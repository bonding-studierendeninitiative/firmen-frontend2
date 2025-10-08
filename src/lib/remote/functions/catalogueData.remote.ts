import { query, form } from '$app/server';
import { file, literal, nonEmpty, nullish, object, pipe, string, union } from 'valibot';
import { Problem } from '@api/client';
import { error } from '@sveltejs/kit';
import { createOrgMemberContext } from '@/remote/context';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UploadCatalogueDataForm } from '@schema';
import { orgMemberCommand, orgMemberQuery } from '../auth-guards';

export const uploadCatalogueData = form(
	object({
		title: pipe(string(), nonEmpty('Cannot be empty')),
		file: file(),
		documentType: union([literal('logo'), literal('advert')])
	}),
	async (input) => {
		try {
			const data = input;
			const buf = Buffer.from(data.file.name, 'utf-8');
			const base64Enc = buf.toString('base64');
			const ctx = await createOrgMemberContext();
			const response = await ctx.api.request(
				'post',
				'/api/v2/organization/{organizationId}/catalogue-data/request-upload-url',
				{
					path: { organizationId:	ctx.session.activeOrganizationId},
					body: {
						title: data.title,
						mimeType: data.file.type,
						originalFilename: base64Enc,
						uploaderId: ctx.session.userId,
						type: data.documentType
					}
				}
			);

			if (!response.ok) {
				error(500, 'The upload could not be completed');
			}

			const { url } = await response.json();
			const uploadResponse = await fetch(url, {
				method: 'PUT',
				body: data.file,
				headers: {
					'x-amz-meta-original-filename': base64Enc,
					'x-amz-meta-uploader-id': ctx.session.userId
				}
			});

			if (!uploadResponse.ok) {
				const txt = await uploadResponse.text();
				console.error(txt);
				error(500, 'The upload could not be completed');
			}
			return {success: true}
		} catch (e) {
			error(500, e instanceof Error ? e.message : 'Failed to upload');
		}
	}
);

export const uploadForm = query('unchecked', async () => {
	const ctx = await createOrgMemberContext();
	return await superValidate(
		{
			orgId: ctx.session.activeOrganizationId
		},
		valibot(UploadCatalogueDataForm),
		{
			errors: false
		}
	);
});

export const getCatalogueByType = orgMemberQuery(
	object({
		documentType: union([literal('logo'), literal('advert')]),
		limit: nullish(string(), '10'),
		cursor: nullish(string(), '0')
	}),
	async ({ input, ctx }) => {
		const response = await ctx.api.get(
			'/api/v2/organization/{organizationId}/catalogue-data/by-document-type/{documentType}',
			{
				path: {
					organizationId: ctx.session.activeOrganizationId,
					documentType: input.documentType
				},
				query: { limit: Number(input.limit), page: Number(input.cursor) }
			}
		);
		return response;
	}
);

export const pickDocument = orgMemberCommand(
	object({ eventRegistrationId: string(), documentId: string(), versionId: string() }),
	async ({ input, ctx }) => {
		const response = await ctx.api.request(
			'post',
			'/api/v2/event-registration/{eventRegistrationId}/pick-document/{documentId}/{versionId}',
			{ path: input }
		);
		if (response.status !== 204) {
			error(500, 'The document could not be picked');
		}
	}
);

export const generateDownloadLink = orgMemberCommand(
	object({ organizationId: string(), documentId: string() }),
	async ({ input, ctx }) => {
		const response = await ctx.api.request(
			'get',
			'/api/v2/organization/{organizationId}/catalogue-data/{documentId}/download',
			{ path: input }
		);
		if (response.status !== 204) {
			error(500, 'Download link could not be generated');
		}
		return response.headers.get('location');
	}
);

export const generateThumbnailLink = orgMemberQuery(
	object({
		documentId: string(),
		resolution: union([literal('small'), literal('medium'), literal('large')])
	}),
	async ({ input, ctx }) => {
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
			error(500, 'Download link could not be generated');
		}
		return response.headers.get('location');
	}
);

export const deleteDocument = orgMemberCommand(
	object({ documentId: string() }),
	async ({ input: { documentId }, ctx }) => {
		const response = await ctx.api.request(
			'delete',
			'/api/v2/organization/{organizationId}/catalogue-data/{documentId}',
			{
				path: { documentId, organizationId: ctx.session.activeOrganizationId },
				query: { 'ignore-conflict': false }
			}
		);
		if (response.status !== 204) {
			const problem = (await response.json()) as Problem;
			error(409, problem.detail || 'Conflict');
		}
	}
);

export const getDocument = orgMemberQuery(
	object({ documentId: string() }),
	async ({ input: { documentId }, ctx }) => {
		const response = await ctx.api.get(
			'/api/v2/organization/{organizationId}/catalogue-data/{documentId}',
			{
				path: { organizationId: ctx.session.activeOrganizationId, documentId }
			}
		);
		return response;
	}
);
