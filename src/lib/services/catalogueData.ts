import {
	type ExportCatalogueDataRequest,
	type ReviewCatalogueDataRequest,
	type UploadCatalogueDataRequest
} from '@schema';
import { API } from '@api';
import { error } from '@sveltejs/kit';
import type { InferOutput } from 'valibot';

export const reviewCatalogueData = async ({
	accessToken,
	eventRegistrationId,
	data: formData
}: {
	accessToken: string;
	eventRegistrationId: string;
	data: InferOutput<ReviewCatalogueDataRequest>;
}) => {
	const response = await API.post({
		route: `/event-registration/${eventRegistrationId}/review-catalogue-data`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 200) {
		const problem = await response.json();
		error(response.status, `The Review was not acknowledged ${problem.detail}`);
	}

	return await response.json();
};

export const uploadCatalogueData = async ({
	accessToken,
	eventRegistrationId,
	data: formData
}: {
	accessToken: string;
	eventRegistrationId: string;
	data: InferOutput<UploadCatalogueDataRequest>;
}) => {
	const response = await API.post<{ url: string }>({
		route: `/event-registration/${eventRegistrationId}/request-upload-url`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 200) {
		error(500, 'The upload could not be completed');
	}

	const { url } = await response.json();

	const uploadResponse = await fetch(url, {
		method: 'PUT',
		body: formData.file
	});

	if (uploadResponse.status !== 200) {
		error(500, 'The upload could not be completed');
	}
};

export const exportCatalogueData = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<ExportCatalogueDataRequest>;
}) => {
	const response = await API.post<{ url: string }>({
		route: `/export/catalogue-data`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 200) {
		error(500, 'The export could not be started');
	}
};
