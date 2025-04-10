import { type ExportCatalogueDataRequest } from '@schema';
import { API } from '@api';
import { error } from '@sveltejs/kit';
import type { InferOutput } from 'valibot';

export const exportCatalogueData = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<ExportCatalogueDataRequest>;
}) => {
	const response = await API.post<{ url: string }>({
		route: `/admin/jobs/export/catalogue-data`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 200) {
		error(500, 'The export could not be started');
	}
};
