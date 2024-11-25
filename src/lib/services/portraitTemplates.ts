import { API } from '@api';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import {
	PortraitTemplateSchema,
	type CreatePortraitTemplateRequest,
	type CreatePortraitTemplateResponse,
	DeletePortraitTemplateRequestSchema,
	GetPortraitTemplateResponse,
	GetPortraitTemplatesResponse,
	type PortraitCompanyDetails,
	type UpdatePortraitTemplateRequest
} from '@schema';

export const getPortraitTemplates = async ({
	accessToken,
	org,
	page = 0
}: {
	accessToken: string;
	org: string;
	page?: number;
}) => {
	const response = await API.get<v.InferInput<typeof GetPortraitTemplatesResponse>>({
		route: `/portrait-template?organizationId=${org}&status=PUBLISHED&page=${page}&limit=6`,
		token: accessToken
	});
	if (response.status === 401) {
		error(401, 'Unauthorized');
	}
	if (response.status === 403) {
		error(403, 'Forbidden');
	}
	if (response.status === 404) {
		error(404, 'Not Found');
	}
	const data = await response.json();
	return v.parse(GetPortraitTemplatesResponse, data);
};

export const getPortraitTemplate = async ({
	accessToken,
	portraitTemplateId
}: {
	accessToken: string;
	portraitTemplateId: string;
}) => {
	const response = await API.get<v.InferInput<typeof GetPortraitTemplateResponse>>({
		route: `/portrait-template/${portraitTemplateId}`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetPortraitTemplateResponse, data);
};

export const createPortraitTemplate = async ({
	accessToken,
	org,
	data: request
}: {
	accessToken: string;
	org: string;
	data: v.InferInput<CreatePortraitTemplateRequest>;
}) => {
	const response = await API.post<v.InferInput<CreatePortraitTemplateResponse>>({
		route: '/portrait-template?organizationId=' + org,
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return v.parse(PortraitTemplateSchema, data);
};

export const deletePortraitTemplate = async ({
	accessToken,
	data: { id }
}: {
	accessToken: string;
	data: v.InferInput<typeof DeletePortraitTemplateRequestSchema>;
}) => {
	const response = await API.delete({
		route: `/portrait-template/${id}`,
		token: accessToken
	});
	if (response.status !== 204) {
		error(404, 'Not Found');
	}
};

export const updatePortraitDetails = async ({
	accessToken,
	id,
	data: request
}: {
	accessToken: string;
	id: string;
	data: Partial<v.InferInput<UpdatePortraitTemplateRequest>>;
}) => {
	const response = await API.put<PortraitCompanyDetails>({
		route: `/portrait-template/${id}`,
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return v.parse(GetPortraitTemplateResponse, data);
};
