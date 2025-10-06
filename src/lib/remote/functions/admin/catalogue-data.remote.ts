import { command, query } from '$app/server';
import { createAdminContext } from '@/remote/context';
import { ExportCatalogueDataRequest } from '@schema';
import { object, string, union, literal } from 'valibot';
import { error } from '@sveltejs/kit';

export const exportCatalogueData = command(ExportCatalogueDataRequest, async (input) => {
	const ctx = await createAdminContext();
	const endpoints = {
		advert: '/api/v2/admin/jobs/export/advertisements',
		logo: '/api/v2/admin/jobs/export/logos',
		portrait: '/api/v2/admin/jobs/export/portraits'
	} as const;
	const path = endpoints[input.documentType];
	const response = await ctx.adminApi.request('post', path, { body: input });

	if (response.status !== 200) {
		error(500, 'The export could not be started');
	}

	const data = (await response.json()) as { jobId: string };

	return data.jobId;
});

export const generateDocumentDownloadLink = query(
	object({ organizationId: string(), documentId: string() }),
	async (input) => {
		const ctx = await createAdminContext();
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

export const generateThumbnailLink = query(
	object({
		documentId: string(),
		organizationId: string(),
		resolution: union([literal('small'), literal('medium'), literal('large')])
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.api.request(
			'get',
			'/api/v2/organization/{organizationId}/catalogue-data/{documentId}/thumbnail',
			{ path: input, query: { resolution: input.resolution } }
		);
		if (response.status !== 204) {
			error(500, 'Thumbnail link could not be generated');
		}
		return response.headers.get('location');
	}
);
