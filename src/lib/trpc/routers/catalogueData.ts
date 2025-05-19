import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { file, nonEmpty, nullish, number, object, parse, pipe, string } from 'valibot';
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
import { TRPCError } from '@trpc/server';
import { GetAllAdvertisementsForOrganizationOutput, GetAllLogosForOrganizationOutput } from '@api/client';

const GetCatalogDataSchema = object({
	limit: nullish(string(), '10'),
	cursor: nullish(string(), '0')
});

export const catalogueDataRouter = router({
	logos: router({
		upload: authorizedOrgMemberProcedure
			.input((input) => parse(
				object({
					title: string(),
					file: file(), // Base64 encoded file
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
			.input((input) => parse(GetCatalogDataSchema, input))
			.query(async ({ ctx, input: { cursor: start, limit } }) => {
				const response = await ctx.api.get("/api/v2/organization/{organizationId}/logo", {
					path: {organizationId: ctx.session.orgId},
					query: {
						limit: Number(limit),
						page: Number(start)
					}
				});
				return response;
			}),
		deleteLogo: authorizedOrgMemberProcedure
			.input((input) => parse(pipe(string(), nonEmpty()), input))
			.mutation(async ({ ctx, input }) => {
				const response = await ctx.api.request("delete", "/api/v2/organization/{organizationId}/logo/{logoId}", {
					path: {
						logoId: input,
						organizationId: ctx.session.orgId
					}
				});

				if (response.status !== 204) {
					throw new TRPCError({ message: 'The logo could not be deleted', code: "INTERNAL_SERVER_ERROR" });
				}
			}),
		pick: authorizedOrgMemberProcedure
			.input((input) => parse(PickLogoRequest, input))
			.mutation(async ({ ctx, input }) => {
				const response = await ctx.api.request("post", "/api/v2/event-registration/{eventRegistrationId}/pick-logo/{logoId}",{
					path: {
						eventRegistrationId: input.eventRegistrationId,
						logoId: input.logoId
					}
				});
			
				if (response.status !== 204) {
					throw new TRPCError({ message: 'The logo could not be picked', code: "INTERNAL_SERVER_ERROR" });
				}
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
			.output((output) => parse(nullish(string()), output))
			.mutation(async ({ ctx, input }) => {
				const response = await ctx.api.request("get", "/api/v2/organization/{organizationId}/logo/{logoId}/download", {
					path: {
						logoId: input.logoId,
						organizationId: input.organizationId
					}
				});
				if (response.status !== 204) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Download link could not be generated"
					})
				}
				return response.headers.get("location");
			})
	}),
	advertisements: router({
		getAll: authorizedOrgMemberProcedure
			.input((input) => parse(GetCatalogDataSchema, input))
			.query(async ({ ctx, input }) => {
				const response = await ctx.api.get("/api/v2/organization/{organizationId}/advertisement",{
					path: {organizationId: ctx.session.orgId},
					query: {
						limit: Number(input.limit),
						page: Number(input.cursor)
					}
				});
				return response;
			}),
		deleteAdvertisement: authorizedOrgMemberProcedure
			.input((input) => parse(pipe(string(), nonEmpty()), input))
			.mutation(async ({ ctx, input }) => {
				await ctx.api.delete("/api/v2/organization/{organizationId}/advertisement/{advertisementId}", {
					path: {
						advertisementId: input,
						organizationId: ctx.session.orgId
					}
				})
			}),
		pick: authorizedOrgMemberProcedure
			.input((input) => parse(PickAdvertisementRequest, input))
			.mutation(async ({ ctx, input }) => {
				await ctx.api.post("/api/v2/event-registration/{eventRegistrationId}/pick-advertisement/{advertisementId}",{
					path: {
						advertisementId: input.advertisementId,
						eventRegistrationId: input.eventRegistrationId,
					}
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
			.output((output) => parse(nullish(string()), output))
			.mutation(async ({ ctx, input }) => {
				const response = await ctx.api.request("get", "/api/v2/organization/{organizationId}/advertisement/{advertisementId}/download", {
					path: {...input}
				});
				if (response.status !== 204) {
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Download link could not be generated"
					})
				}
				return response.headers.get("location");
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
