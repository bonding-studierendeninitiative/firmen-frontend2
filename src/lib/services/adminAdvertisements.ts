import type { InferOutput } from 'valibot';
import type { ExportAdvertisementsRequest, ReviewAdvertisementRequest } from '@schema';
import { API } from '@api';
import { error } from '@sveltejs/kit';

export const reviewAdvertisement = async ({
	accessToken,
	advertisementId,
	data: formData
}: {
	accessToken: string;
	advertisementId: string;
	data: InferOutput<ReviewAdvertisementRequest>;
}) => {
	const response = await API.post({
		route: `/admin/advertisement/${advertisementId}/review`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 200) {
		const problem = await response.json();
		error(response.status, `The review was not acknowledged ${problem.detail}`);
	}

	return await response.json();
};

export const exportAdvertisements = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<ExportAdvertisementsRequest>;
}) => {
	const response = await API.post<{
		status: 'string';
		jobId: 'string';
		message: 'string';
	}>({
		route: `/admin/jobs/export/advertisements`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 200) {
		error(500, 'The export could not be started');
	}

	const data = await response.json();

	return data.jobId;
};
