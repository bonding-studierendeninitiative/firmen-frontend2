import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { nonEmpty, nullish, object, parse, pipe, string } from 'valibot';
import {
	deleteAdvertisement,
	deleteLogo,
	deletePortraitTemplate,
	getOrgAdvertisements,
	getOrgLogos,
	pickAdvertisement,
	pickLogo
} from '@/services';
import {
	DeletePortraitTemplateRequestSchema,
	PickAdvertisementRequest,
	PickLogoRequest,
	UploadAdvertisementRequest,
	UploadCatalogueDataForm,
	UploadLogoRequest
} from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { API } from '@api';

const GetCatalogDataSchema = object({
	limit: nullish(string(), '10'),
	cursor: nullish(string(), '0')
});

export const catalogueDataRouter = router({
	logos: router({
		getAll: authorizedOrgMemberProcedure
			.input((input) => parse(GetCatalogDataSchema, input))
			.query(async ({ ctx, input: { cursor: start, limit } }) => {
				return await getOrgLogos({
					accessToken: ctx.token.jwt,
					organizationId: ctx.session.orgId,
					page: start,
					limit
				});
			}),
		deleteLogo: authorizedOrgMemberProcedure
			.input((input) => parse(pipe(string(), nonEmpty()), input))
			.mutation(async ({ ctx, input }) => {
				await deleteLogo({
					accessToken: ctx.token.jwt,
					data: {
						logoId: input,
						organizationId: ctx.session.orgId
					}
				});
			}),
		pick: authorizedOrgMemberProcedure
			.input((input) => parse(PickLogoRequest, input))
			.mutation(async ({ ctx, input }) => {
				await pickLogo({
					accessToken: ctx.token.jwt,
					data: input
				});
			}),
		uploadForm: authorizedOrgMemberProcedure.query(async ({ ctx }) => {
			return await superValidate(
				{
					orgId: ctx.session.orgId
				},
				valibot(UploadLogoRequest),
				{
					errors: false
				}
			);
		}),
		generateDownloadLink: authorizedOrgMemberProcedure
			.input((input) =>
				parse(
					object({
						organizationId: string(),
						logoId: string()
					}),
					input
				)
			)
			.output((output) => parse(string(), output))
			.mutation(async ({ ctx, input }) => {
				const response = await API.get<string>({
					route: `/organization/${input.organizationId}/logo/${input.logoId}/download`,
					token: ctx.token.jwt
				});
				return await response.text();
			})
	}),
	advertisements: router({
		getAll: authorizedOrgMemberProcedure
			.input((input) => parse(GetCatalogDataSchema, input))
			.query(async ({ ctx, input }) => {
				return await getOrgAdvertisements({
					accessToken: ctx.token.jwt,
					organizationId: ctx.session.orgId,
					page: input.cursor
				});
			}),
		deleteAdvertisement: authorizedOrgMemberProcedure
			.input((input) => parse(pipe(string(), nonEmpty()), input))
			.mutation(async ({ ctx, input }) => {
				await deleteAdvertisement({
					accessToken: ctx.token.jwt,
					data: {
						advertisementId: input,
						organizationId: ctx.session.orgId
					}
				});
			}),
		pick: authorizedOrgMemberProcedure
			.input((input) => parse(PickAdvertisementRequest, input))
			.mutation(async ({ ctx, input }) => {
				await pickAdvertisement({
					accessToken: ctx.token.jwt,
					data: input
				});
			}),
		uploadForm: authorizedOrgMemberProcedure.query(async ({ ctx }) => {
			return await superValidate(
				{
					orgId: ctx.session.orgId
				},
				valibot(UploadAdvertisementRequest),
				{
					errors: false
				}
			);
		}),
		generateDownloadLink: authorizedOrgMemberProcedure
			.input((input) =>
				parse(
					object({
						organizationId: string(),
						advertisementId: string()
					}),
					input
				)
			)
			.output((output) => parse(string(), output))
			.mutation(async ({ ctx, input }) => {
				const response = await API.get<string>({
					route: `/organization/${input.organizationId}/advertisement/${input.advertisementId}/download`,
					token: ctx.token.jwt
				});
				return await response.text();
			})
	}),
	portraits: router({
		deletePortrait: authorizedOrgMemberProcedure
			.input((input) => parse(DeletePortraitTemplateRequestSchema, input))
			.mutation(async ({ ctx, input }) => {
				await deletePortraitTemplate({
					accessToken: ctx.token.jwt,
					data: input
				});
			})
	}),
	uploadForm: authorizedOrgMemberProcedure.query(async ({ ctx }) => {
		return await superValidate(
			{
				orgSlug: ctx.session.orgId
			},
			valibot(UploadCatalogueDataForm),
			{
				errors: false
			}
		);
	})
});
