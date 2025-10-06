import {
	GetBillingAddressTemplateForOrganizationResponse,
	BillingAddressTemplate,
	CreateBillingAddressTemplateForm
} from '@schema';
import { authorizedOrgMemberProcedure, router } from '../server';
import { object, nullish, parse, string } from 'valibot';
import { TRPCError } from '@trpc/server';

export const billingAddressTemplateRouter = router({
	getAll: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					organizationId: string(),
					page: nullish(string(), '0'),
					limit: nullish(string(), '10')
				}),
				input
			)
		)
		.output((output) => parse(GetBillingAddressTemplateForOrganizationResponse, output))
		.query(async ({ ctx, input }) => {
			const response = await ctx.api.request(
				'get',
				'/api/v2/organization/{organizationId}/billing-address-template',
				{
					path: {
						organizationId: input.organizationId
					},
					query: {
						page: Number(input.page) ?? 0,
						size: Number(input.limit) ?? 10
					}
				}
			);

			if (response.status !== 200) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: `Could not get billing address templates: ${response.statusText}, ${await response.text()}`
				});
			}

			return await response.json();
		}),
	create: authorizedOrgMemberProcedure
		.input((input) => parse(CreateBillingAddressTemplateForm, input))
		.output((output) => parse(BillingAddressTemplate, output))
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.api.request(
				'post',
				'/api/v2/organization/{organizationId}/billing-address-template',
				{
					path: {
						organizationId: ctx.session.activeOrganizationId
					},
					body: input
				}
			);

			if (response.status !== 200) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'The billing address template could not be created'
				});
			}

			return await response.json();
		}),
	delete: authorizedOrgMemberProcedure
		.input((input) => parse(string(), input))
		.mutation(async ({ ctx, input: billingAddressTemplateId }) => {
			const response = await ctx.api.request(
				'delete',
				'/api/v2/organization/{organizationId}/billing-address-template/{billingAddressTemplateId}',
				{
					path: {
						organizationId: ctx.session.activeOrganizationId,
						billingAddressTemplateId
					}
				}
			);

			if (response.status !== 204) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'The billing address template could not be deleted'
				});
			}
		}),
	makeDefault: authorizedOrgMemberProcedure
		.input((input) => parse(string(), input))
		.mutation(async ({ ctx, input: billingAddressTemplateId }) => {
			await ctx.auth.updateOrganization({
				body: {
					organizationId: ctx.session.activeOrganizationId,
					data: {
						metadata: {
							public: {
								defaultBillingAddressTemplateId: billingAddressTemplateId
							}
						}
					}
				},
				headers: {
					Authorization: `Bearer ${ctx.session.token}`
				}
			});
		})
});
