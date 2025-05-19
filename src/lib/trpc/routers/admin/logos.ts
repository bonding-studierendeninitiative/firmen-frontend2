import { adminProcedure, router } from '@/trpc/server';
import { object, parse, string } from 'valibot';
import { TRPCError } from '@trpc/server';
import type { ReviewLogoRequest } from '@schema';

export const adminLogosRouter = router({
    review: adminProcedure
        .input((input) => parse(
            object({
                logoId: string(),
                data: object({}) as ReviewLogoRequest
            }),
            input
        ))
        .mutation(async ({ ctx, input }) => {
            const response = await ctx.adminApi.request("post", "/api/v2/admin/logo/{logoId}/review", {
                path: { logoId: input.logoId },
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