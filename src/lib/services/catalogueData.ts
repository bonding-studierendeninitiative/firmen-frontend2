import { type ReviewCatalogueDataRequest } from '@schema';
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
		route: `/event-registration/${eventRegistrationId}/reviewCatalogueData`,
		token: accessToken,
		data: formData
	});

	if (response.status !== 204) {
		error(500, 'The portrait was not rejected');
	}

	return await response.json();
};
