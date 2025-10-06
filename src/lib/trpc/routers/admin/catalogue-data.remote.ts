import { command } from '$app/server';
import { createAdminContext } from '@/trpc/server';
import { ExportCatalogueDataRequest } from '@schema';
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
