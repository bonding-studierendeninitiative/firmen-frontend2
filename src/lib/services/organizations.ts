import { API } from '@api';
import {
	CreateOrganizationRequestSchema,
	CreateOrganizationResponse,
	GetOrgDetailsResponse,
	GetOrgMembershipsResponseSchema,
	GetOrgMembersResponseSchema,
	CreateOrgInviteRequestSchema,
	type CreateOrganizationRequest,
	type GetOrgMembershipsResponse,
	type GetOrgMembersResponse,
	type CreateOrgInviteRequest,
	type AcceptInviteRequest,
	AcceptInviteRequestSchema,
	type SetOrgDetailsRequest,
	SetOrgDetailsRequestSchema,
	getOrganizationsResponse
} from '@schema';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import type { InferInput } from 'valibot';

export const acceptOrgInvite = async ({
	accessToken,
	data
}: {
	accessToken: string;
	data: InferInput<AcceptInviteRequest>;
}) => {
	const parsed = v.parse(AcceptInviteRequestSchema, data);
	const response = await API.post({
		route: '/organization/accept-invite',
		token: accessToken,
		data: parsed
	});

	if (response.status === 400) {
		error(400, 'Bad Request');
	}

	if (response.status === 401) {
		error(401, 'Unauthorized');
	}

	if (response.status === 404) {
		error(404, 'Organization not found');
	}

	if (response.status === 422) {
		error(404, 'Organization not found');
	}

	return true;
};

export const generateOrgInvite = async ({
	accessToken,
	data
}: {
	accessToken: string;
	data: CreateOrgInviteRequest;
}) => {
	const parsed = v.parse(CreateOrgInviteRequestSchema, data);
	const response = await API.post({
		route: '/organization/create-invite',
		token: accessToken,
		data: parsed
	});

	if (response.status === 400) {
		error(400, 'Bad Request');
	}

	if (response.status === 401) {
		error(401, 'Unauthorized');
	}

	if (response.status === 404) {
		error(404, 'Organization not found');
	}

	if (response.status === 422) {
		error(404, 'Organization not found');
	}

	return true;
};

export const getOrganizationMembers = async ({
	accessToken,
	slug,
	page = 0
}: {
	accessToken: string;
	slug: string;
	page?: number;
}) => {
	try {
		const response = await API.get<InferInput<GetOrgMembersResponse>>({
			route: `/organization/${slug}/members?page=${page}&pageSize=10`,
			token: accessToken
		});
		if (response.status === 401) {
			error(401, 'Unauthorized');
		}

		if (response.status === 404) {
			error(404, 'Organization not found');
		}

		if (response.status === 422) {
			error(404, 'Organization not found');
		}

		const data = await response.json();
		return v.parse(GetOrgMembersResponseSchema, data);
	} catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
};

export const getOrgMemberships = async ({ accessToken }: { accessToken: string }) => {
	try {
		const response = await API.get<GetOrgMembershipsResponse>({
			route: '/contact-person/memberships?page=0&limit=4',
			token: accessToken
		});

		if (response.status === 204) {
			return [];
		}

		if (response.status === 404) {
			return [];
		}

		const data = await response.json();
		const responseJson = v.parse(GetOrgMembershipsResponseSchema, data);
		return responseJson.memberships;
	} catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
};

export const getOrganizationDetails = async ({
	accessToken,
	slug
}: {
	accessToken: string;
	slug: string;
}) => {
	const response = await API.get({
		route: `/organization/${slug}`,
		token: accessToken
	});

	if (response.status === 401) {
		error(401, 'Unauthorized');
	}

	if (response.status === 404) {
		error(404, 'Organization not found');
	}

	if (response.status === 422) {
		error(404, 'Organization not found');
	}

	const data = await response.json();
	return v.parse(GetOrgDetailsResponse, data);
};

export const setOrgDetails = async ({
	accessToken,
	orgSlug,
	data
}: {
	accessToken: string;
	orgSlug: string;
	data: SetOrgDetailsRequest;
}) => {
	try {
		const parsed = v.parse(SetOrgDetailsRequestSchema, data);
		const response = await API.put({
			route: `/organization/${orgSlug}`,
			token: accessToken,
			data: parsed
		});

		if (response.status === 400) {
			error(400, 'Bad Request');
		}

		if (response.status === 401) {
			error(401, 'Unauthorized');
		}

		if (response.status === 403) {
			error(401, 'Unauthorized');
		}

		if (response.status === 404) {
			error(404, 'Organization not found');
		}

		if (response.status === 422) {
			error(404, 'Organization not found');
		}

		return true;
	} catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
};

export const createOrganization = async ({
	accessToken,
	data
}: {
	accessToken: string;
	data: CreateOrganizationRequest;
}) => {
	try {
		const parsed = v.parse(CreateOrganizationRequestSchema, data);
		const response = await API.post({
			route: '/organization',
			token: accessToken,
			data: parsed
		});
		const responseData = await response.json();
		const responseJson = v.parse(CreateOrganizationResponse, responseData);
		return responseJson.createdOrganization;
	} catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
};

export const getOrgs = async ({
	accessToken,
	page = 0
}: {
	accessToken: string;
	page?: number;
}) => {
	const response = await API.get({
		route: `/organization?page=${page}`,
		token: accessToken
	});
	const responseData = await response.json();
	return v.parse(getOrganizationsResponse, responseData);
};
