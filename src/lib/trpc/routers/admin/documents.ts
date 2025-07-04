import { adminProcedure, router } from '@/trpc/server';
import { nonEmpty, object, parse, pipe, string } from 'valibot';
import { TRPCError } from '@trpc/server';
import { ReviewDocumentRequest } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const adminDocumentsRouter = router({
    review: adminProcedure
        .input((input) => parse(
            object({
                documentId: pipe(string(), nonEmpty()),
                data: ReviewDocumentRequest
            }),
            input
        ))
        .mutation(async ({ ctx, input }) => {
            const response = await ctx.adminApi.request("post", "/api/v2/admin/registration-document/{registrationDocumentId}/review", {
                path: { registrationDocumentId: input.documentId },
                body: input.data
            });

            if (response.status !== 200) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'The review was not acknowledged'
                });
            }

            return response;
        }),
        reviewForm: adminProcedure.query(async () => {
			return await superValidate(valibot(ReviewDocumentRequest), {
				id: 'reviewDocumentForm'
			});
		})
}); 