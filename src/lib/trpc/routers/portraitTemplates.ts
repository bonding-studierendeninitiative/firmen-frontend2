import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { object, parse, string, number, partial } from 'valibot';
import { TRPCError } from '@trpc/server';
import { PortraitTemplateInput } from '@api/client';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UpdatePortraitTemplateRequestSchema } from '@schema';

export const portraitTemplatesRouter = router({
    getAll: authorizedOrgMemberProcedure
        .input((input) => parse(
            object({
                page: number(),
                query: string()
            }),
            input
        ))
        .query(async ({ ctx, input }) => {
            try {
                const response = await ctx.api.get("/api/v2/portrait-template", {
                    query: {
                        organizationId: ctx.session.orgId,
                        title: input.query,
                        page: input.page,
                        limit: 9
                    }
                });
                return response;
            } catch (error) {
                console.error(error);
                return {
                    portraitTemplates: [],
                    totalElements: 0,
                    totalPages: 0,
                    pageNumber: 0
                };
            }
        }),

    get: authorizedOrgMemberProcedure
        .input((input) => parse(string(), input))
        .query(async ({ ctx, input: portraitTemplateId }) => {
            const response = await ctx.api.get("/api/v2/portrait-template/{portraitTemplateId}", {
                path: { portraitTemplateId }
            });
            return response;
        }),
    editForm: authorizedOrgMemberProcedure
        .input((input) => parse(string(), input))
        .query(async ({ ctx, input: portraitTemplateId }) => {
            const response = await ctx.api.get("/api/v2/portrait-template/{portraitTemplateId}", {
                path: { portraitTemplateId }
            });
            return await superValidate(response, valibot(UpdatePortraitTemplateRequestSchema));
        }),
    create: authorizedOrgMemberProcedure
        .input((input) => parse(PortraitTemplateInput, input))
        .mutation(async ({ ctx, input }) => {
            const response = await ctx.api.post("/api/v2/portrait-template", {
                query: { organizationId: ctx.session.orgId },
                body: input
            });
            return response;
        }),

    delete: authorizedOrgMemberProcedure
        .input((input) => parse(string(), input))
        .mutation(async ({ ctx, input: id }) => {
            const response = await ctx.api.request("delete", "/api/v2/portrait-template/{portraitTemplateId}", {
                path: { portraitTemplateId: id }
            });

            if (response.status !== 204) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Portrait template not found'
                });
            }
        }),

    update: authorizedOrgMemberProcedure
        .input((input) => parse(
            object({
                id: string(),
                data: partial(PortraitTemplateInput)
            }),
            input
        ))
        .mutation(async ({ ctx, input }) => {
            const response = await ctx.api.put("/api/v2/portrait-template/{portraitTemplateId}", {
                path: { portraitTemplateId: input.id },
                body: input.data
            });
            return response;
        })
}); 