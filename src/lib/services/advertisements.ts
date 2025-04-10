import { type InferOutput, parse } from 'valibot';
import { API } from '@api';
import {
	type DeleteAdvertisementRequest,
	OrgAdvertisementResponse,
	type PickAdvertisementRequest
} from '@schema/advertisements';
import type { UploadAdvertisementRequest } from '@schema';
import { error } from '@sveltejs/kit';
import { createLogger } from 'vite';

const logger = createLogger();

export async function getOrgAdvertisements({
	organizationId,
	accessToken,
	fetch: fetchF = fetch,
	page = '0'
}: {
	organizationId: string;
	accessToken: string;
	fetch?: typeof fetch;
	page?: string;
}) {
	const searchParams = new URLSearchParams({
		page,
		limit: '10',
		sortBy: 'name', // default sort key, can be adjusted
		sortDirection: 'desc' // default sort direction, can be adjusted
	}).toString();

	const response = await API.get({
		route: `/organization/${organizationId}/advertisement?${searchParams}`,
		token: accessToken,
		fetch: fetchF
	});
	const data = await response.json();
	return parse(OrgAdvertisementResponse, data);
}

export const uploadAdvertisement = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<UploadAdvertisementRequest>;
}) => {
	const response = await API.post<{ url: string }>({
		route: `/organization/${formData.orgId}/advertisement/request-upload-url`,
		token: accessToken,
		data: {
			title: formData.title
		}
	});

	if (response.status !== 200) {
		error(500, 'The upload could not be completed');
	}

	const { url } = await response.json();

	const uploadResponse = await fetch(url, {
		method: 'PUT',
		body: formData.file,
		headers: {
			'x-amz-meta-title': btoa(formData.title)
		}
	});

	if (uploadResponse.status !== 200) {
		logger.error(`The upload could not be completed: ${await uploadResponse.text()}`);
		error(500, 'The upload could not be completed');
	}
};

export const pickAdvertisement = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<PickAdvertisementRequest>;
}) => {
	const response = await API.post<{ url: string }>({
		route: `/event-registration/${formData.eventRegistrationId}/pick-advertisement/${formData.advertisementId}`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(500, 'The advertisement could not be picked');
	}
};

export const deleteAdvertisement = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<DeleteAdvertisementRequest>;
}) => {
	const response = await API.delete<{ url: string }>({
		route: `/organization/${formData.organizationId}/advertisement/${formData.advertisementId}`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(500, 'The advertisement could not be deleted');
	}
};
