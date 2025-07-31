import { adminProcedure, router } from '@/trpc/server';
import { object, parse, string } from 'valibot';
import { TRPCError } from '@trpc/server';
import { ReviewCatalogueDataInput } from '@api/admin-client';

export const adminLogosRouter = router({
    review: adminProcedure
        .input((input) => parse(
            object({
                logoId: string(),
                data: ReviewCatalogueDataInput
            }),
            input
        ))
        .mutation(async ({ ctx, input }) => {
            const response = await ctx.adminApi.request("post", "/api/v2/admin/registration-document/{registrationDocumentId}/review", {
                path: { registrationDocumentId: input.logoId },
                body: input.data
            });

            if (response.status !== 200) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: 'The review was not acknowledged'
                });
            }

            return response;
        })
}); 