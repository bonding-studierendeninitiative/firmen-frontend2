import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { file, literal, nonEmpty, nullish, object, parse, pipe, string, union } from 'valibot';
import { UploadCatalogueDataForm } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { TRPCError } from '@trpc/server';
import type { Problem } from '@api/client';

const GetCatalogDataSchema = object({
	documentType: union([literal('logo'), literal('advert')]),
	limit: nullish(string(), '10'),
	cursor: nullish(string(), '0')
});

export const catalogueDataRouter = router({
	upload: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					title: string(),
					file: file(), // Base64 encoded file
					orgId: string(),
					documentType: union([literal('logo'), literal('advert')])
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const buf = Buffer.from(input.file.name, 'utf-8');

				const base64Enc = buf.toString('base64');

				const response = await ctx.api.request(
					'post',
					'/api/v2/organization/{organizationId}/catalogue-data/request-upload-url',
					{
						path: { organizationId: input.orgId },
						body: {
							title: input.title,
							mimeType: input.file.type,
							originalFilename: base64Enc,
							type: input.documentType
						}
					}
				);

				if (!response.ok) {
					throw new TRPCError({
						code: 'INTERNAL_SERVER_ERROR',
						message: 'The upload could not be completed'
					});
				}

				const { url } = await response.json();

				console.log({ filename: input.file.name, base64Enc, buf });

				const uploadResponse = await fetch(url, {
					method: 'PUT',
					body: input.file,
					headers: {
						'x-amz-meta-original-filename': base64Enc
					}
				});

				if (!uploadResponse.ok) {
					const error = await uploadResponse.text();
					console.error(error);
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
		.query(async ({ ctx, input: { cursor: start, limit, documentType } }) => {
			const response = await ctx.api.get(
				'/api/v2/organization/{organizationId}/catalogue-data/by-document-type/{documentType}',
				{
					path: {
						organizationId: ctx.session.activeOrganizationId,
						documentType
					},
					query: {
						limit: Number(limit),
						page: Number(start)
					}
				}
			);
			return response;
		}),
	getDocument: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					documentId: string()
				}),
				input
			)
		)
		.query(async ({ ctx, input: { documentId } }) => {
			const response = await ctx.api.get(
				'/api/v2/organization/{organizationId}/catalogue-data/{documentId}',
				{
					path: {
						organizationId: ctx.session.activeOrganizationId,
						documentId
					}
				}
			);
			return response;
		}),
	getDocumentVersionDescription: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					documentId: string(),
					versionId: string()
				}),
				input
			)
		)
		.query(async ({ ctx, input: { documentId, versionId } }) => {
			const response = await ctx.api.get(
				'/api/v2/organization/{organizationId}/catalogue-data/{documentId}/versions/{versionId}/description',
				{
					path: {
						organizationId: ctx.session.activeOrganizationId,
						documentId,
						versionId
					}
				}
			);
			return response;
		}),
	pickDocument: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					eventRegistrationId: string(),
					documentId: string(),
					versionId: string()
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.api.request(
				'post',
				'/api/v2/event-registration/{eventRegistrationId}/pick-document/{documentId}/{versionId}',
				{
					path: input
				}
			);

			if (response.status !== 204) {
				throw new TRPCError({
					message: 'The document could not be picked',
					code: 'INTERNAL_SERVER_ERROR'
				});
			}
		}),
	generateDownloadLink: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					organizationId: string(),
					documentId: string()
				}),
				input
			)
		)
		.output((output) => parse(nullish(string()), output))
		.query(async ({ ctx, input }) => {
			const response = await ctx.api.request(
				'get',
				'/api/v2/organization/{organizationId}/catalogue-data/{documentId}/download',
				{
					path: {
						documentId: input.documentId,
						organizationId: input.organizationId
					}
				}
			);
			if (response.status !== 204) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Download link could not be generated'
				});
			}
			return response.headers.get('location');
		}),
	generateThumbnailLink: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					documentId: string(),
					resolution: union([literal('small'), literal('medium'), literal('large')])
				}),
				input
			)
		)
		.output((output) => parse(nullish(string()), output))
		.query(async ({ ctx, input }) => {
			const response = await ctx.api.request(
				'get',
				'/api/v2/organization/{organizationId}/catalogue-data/{documentId}/thumbnail',
				{
					path: {
						documentId: input.documentId,
						organizationId: ctx.session.activeOrganizationId
					},
					query: {
						resolution: input.resolution
					}
				}
			);
			if (response.status !== 204) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: 'Download link could not be generated'
				});
			}
			return response.headers.get('location');
		}),
	deleteDocument: authorizedOrgMemberProcedure
		.input((input) => parse(pipe(string(), nonEmpty()), input))
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.api.request(
				'delete',
				'/api/v2/organization/{organizationId}/catalogue-data/{documentId}',
				{
					path: {
						documentId: input,
						organizationId: ctx.session.activeOrganizationId
					},
					query: {
						'ignore-conflict': false
					}
				}
			);
			if (response.status !== 204) {
				const problem = (await response.json()) as Problem;
				throw new TRPCError({ code: 'CONFLICT', message: problem.detail });
			}
		}),
	uploadForm: authorizedOrgMemberProcedure.query(async ({ ctx }) => {
		return await superValidate(
			{
				orgId: ctx.session.activeOrganizationId
			},
			valibot(UploadCatalogueDataForm),
			{
				errors: false
			}
		);
	})
});
