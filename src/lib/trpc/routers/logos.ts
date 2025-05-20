import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { object, parse, string } from 'valibot';
import { TRPCError } from '@trpc/server';

export const logosRouter = router({
    upload: authorizedOrgMemberProcedure
        .input((input) => parse(
            object({
                title: string(),
                file: string(), // Base64 encoded file
                orgId: string()
            }),
            input
        ))
        .mutation(async ({ ctx, input }) => {
            try {
                const response = await ctx.api.request("post", "/api/v2/organization/{organizationId}/logo/request-upload-url", {
                    path: { organizationId: input.orgId },
                    body: {
                        title: input.title
                    }
                });

                if (!response.ok) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'The upload could not be completed'
                    });
                }

                const { url } = await response.json();

                const uploadResponse = await fetch(url, {
                    method: 'PUT',
                    body: input.file,
                    headers: {
                        'x-amz-meta-title': btoa(input.title)
                    }
                });

                if (!uploadResponse.ok) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'The upload could not be completed'
                    });
                }
            } catch (e) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: e instanceof Error ? e.message : 'Failed to upload logo'
                });
            }
        }),
    getAll: authorizedOrgMemberProcedure
        .input((input) => parse(
            object({
                organizationId: string()
            }),
            input
        ))
        .query(async ({ ctx, input }) => {
            try {
                const response = await ctx.api.get("/api/v2/organization/{organizationId}/logo", {
                    path: { organizationId: input.organizationId },
                    query: {
                        page: 0,
                        limit: 10
                    }
                });
                return response;
            } catch (e) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: e instanceof Error ? e.message : 'Failed to get logos'
                });
            }
        }),
    delete: authorizedOrgMemberProcedure
        .input((input) => parse(
            object({
                organizationId: string(),
                logoId: string()
            }),
            input
        ))
        .mutation(async ({ ctx, input }) => {
            try {
                const response = await ctx.api.request("delete", "/api/v2/organization/{organizationId}/logo/{logoId}", {
                    path: {
                        organizationId: input.organizationId,
                        logoId: input.logoId
                    }
                });

                if (!response.ok) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Failed to delete logo'
                    });
                }
            } catch (e) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: e instanceof Error ? e.message : 'Failed to delete logo'
                });
            }
        }),
    getDownloadUrl: authorizedOrgMemberProcedure
        .input((input) => parse(
            object({
                organizationId: string(),
                logoId: string()
            }),
            input
        ))
        .query(async ({ ctx, input }) => {
            try {
                const response = await ctx.api.request("get", "/api/v2/organization/{organizationId}/logo/{logoId}/download", {
                    path: {
                        organizationId: input.organizationId,
                        logoId: input.logoId
                    }
                });

                if (!response.ok) {
                    throw new TRPCError({
                        code: 'INTERNAL_SERVER_ERROR',
                        message: 'Failed to get download URL'
                    });
                }

                return response.headers.get('location');
            } catch (e) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: e instanceof Error ? e.message : 'Failed to get download URL'
                });
            }
        })
}); 