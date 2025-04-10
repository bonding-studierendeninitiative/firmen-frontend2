import { type InferOutput, parse } from 'valibot';
import { API } from '@api';
import { LogosResponse, type PickLogoRequest } from '@schema/logos';
import type { DeleteLogoRequest, UploadLogoRequest } from '@schema';
import { error } from '@sveltejs/kit';

export async function getOrgLogos({
	organizationId,
	accessToken,
	fetch: fetchF = fetch,
	page = '0',
	limit = '10',
	sortBy = 'name',
	sortDirection = 'desc'
}: {
	organizationId: string;
	accessToken: string;
	fetch?: typeof fetch;
	page?: `${number}`;
	limit?: `${number}`;
	sortBy?: string;
	sortDirection?: 'desc' | 'asc';
}) {
	const searchParams = new URLSearchParams({
		page,
		limit,
		sortBy,
		sortDirection
	}).toString();

	const response = await API.get({
		route: `/organization/${organizationId}/logo?${searchParams}`,
		token: accessToken,
		fetch: fetchF
	});
	const data = await response.json();
	return parse(LogosResponse, data);
}

export const pickLogo = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<PickLogoRequest>;
}) => {
	const response = await API.post<{ url: string }>({
		route: `/event-registration/${formData.eventRegistrationId}/pick-logo/${formData.logoId}`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(500, 'The logo could not be picked');
	}
};

export const uploadLogo = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<UploadLogoRequest>;
}) => {
	const response = await API.post<{ url: string }>({
		route: `/organization/${formData.orgId}/logo/request-upload-url`,
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
		error(500, 'The upload could not be completed');
	}
};

export const deleteLogo = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: InferOutput<DeleteLogoRequest>;
}) => {
	const response = await API.delete<{ url: string }>({
		route: `/organization/${formData.organizationId}/logo/${formData.logoId}`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(500, 'The logo could not be deleted');
	}
};
