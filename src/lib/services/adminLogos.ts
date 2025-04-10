import type { InferOutput } from 'valibot';
import type { ExportLogosRequest, ReviewLogoRequest } from '@schema';
import { API } from '@api';
import { error } from '@sveltejs/kit';

export const reviewLogo = async ({
	accessToken,
	logoId,
	data: formData
}: {
	accessToken: string;
	logoId: string;
	data: InferOutput<ReviewLogoRequest>;
}) => {
	const response = await API.post({
		route: `/admin/logo/${logoId}/review`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 200) {
		const problem = await response.json();
		error(response.status, `The review was not acknowledged ${problem.detail}`);
	}

	return await response.json();
};

export const exportLogos = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<ExportLogosRequest>;
}) => {
	const response = await API.post<{
		status: 'string';
		jobId: 'string';
		message: 'string';
	}>({
		route: `/admin/jobs/export/logos`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 200) {
		error(500, 'The export could not be started');
	}

	const data = await response.json();

	return data.jobId;
};
