import { adminProcedure, router } from '@/trpc/server';
import { DetailedLegacyOrganization, ImportLegacyOrganizationRequest, PagedLegacyOrganizationResponse } from '@api/admin-client';
import { TRPCError } from '@trpc/server';
import { array, nullish, object, optional, parse, string } from 'valibot';

export const adminLegacyOrganizationsRouter = router({
    getAll: adminProcedure
        .input((input) =>
            parse(
                object({
                    page: string(),
                    size: string(),
                    query: string(),
                }),
                input
            )
        )
        .output((output) =>
            parse(PagedLegacyOrganizationResponse, output))
        .query(async ({ input, ctx }) => {
            const response = await ctx.adminApi.get("/api/v2/admin/organization", {
                query: {
                    page: Number(input.page),
                    query: input.query,
                    size: Number(input.size)
                },
            });
            return response;
        }),
    getDetails: adminProcedure
        .input((input) =>
            parse(
                object({
                    orgId: string(),
                }),
                input
            )
        )
        .output((output) =>
            parse(DetailedLegacyOrganization, output))
        .query(async ({ input, ctx }) => {
            const response = await ctx.adminApi.get("/api/v2/admin/organization/{id}", {
                path: {
                    id: input.orgId
                }
            });
            return response;
        }),
    import: adminProcedure
        .input((input) => 
        parse(
            object({
                legacyOrgId: string(),
                request: ImportLegacyOrganizationRequest
            }),
            input
        ))
        .mutation(async ({ctx, input}) => {
            const response = await ctx.adminApi.request("post", "/api/v2/admin/organization/{id}/import", {
                path: {
                    id: input.legacyOrgId
                },
                body: input.request
            })

            if (response.status !== 200) {
                throw new TRPCError({
                    message: "Organization could not be imported",
                    code: "INTERNAL_SERVER_ERROR"
                })
            }
        })
});
