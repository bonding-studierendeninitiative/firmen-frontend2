import { adminProcedure, router } from '@/trpc/server';
import { object, parse, string } from 'valibot';
import { TRPCError } from '@trpc/server';
import type { ReviewAdvertisementRequest } from '@schema';

export const adminAdvertisementsRouter = router({
    review: adminProcedure
        .input((input) => parse(
            object({
                advertisementId: string(),
                data: object({}) as ReviewAdvertisementRequest
            }),
            input
        ))
        .mutation(async ({ ctx, input }) => {
            const response = await ctx.adminApi.request("post", "/api/v2/admin/advertisement/{advertisementId}/review", {
                path: { advertisementId: input.advertisementId },
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