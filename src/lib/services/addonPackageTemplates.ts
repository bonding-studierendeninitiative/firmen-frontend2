import * as v from 'valibot';
import { API } from '@api';
import {
	type CreateAddonPackageTemplateRequest,
	type CreateAddonPackageTemplateResponse,
	CreateAddonPackageTemplateResponseSchema,
	type GetAddonPackageTemplateResponse,
	GetAddonPackageTemplateResponseSchema,
	type GetAddonPackageTemplatesResponse,
	GetAddonPackageTemplatesResponseSchema
} from '@schema/addonPackageTemplates';
import { error } from '@sveltejs/kit';
import type { InferInput, InferOutput } from 'valibot';

export const createAddonPackageTemplate = async ({
	accessToken,
	data: request
}: {
	accessToken: string;
	data: InferOutput<CreateAddonPackageTemplateRequest>;
}) => {
	const response = await API.post<InferInput<CreateAddonPackageTemplateResponse>>({
		route: '/addon-package-template',
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return v.parse(CreateAddonPackageTemplateResponseSchema, data);
};

export const deleteAddonPackageTemplate = async ({
	accessToken,
	addonPackageTemplateId
}: {
	accessToken: string;
	addonPackageTemplateId: string;
}) => {
	const response = await API.delete({
		route: `/addon-package-template/${addonPackageTemplateId}`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(404, 'Not Found');
	}
};

export const getAddonPackageTemplate = async ({
	accessToken,
	addonPackageTemplateId
}: {
	accessToken: string;
	addonPackageTemplateId: string;
}) => {
	const response = await API.get<InferInput<GetAddonPackageTemplateResponse>>({
		route: `/addon-package-template/${addonPackageTemplateId}`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetAddonPackageTemplateResponseSchema, data);
};

export const getAddonPackageTemplates = async ({
	accessToken,
	page = 0
}: {
	accessToken: string;
	page?: number;
}): Promise<InferOutput<GetAddonPackageTemplatesResponse>> => {
	const response = await API.get<InferInput<GetAddonPackageTemplatesResponse>>({
		route: `/addon-package-template?page=${page}&limit=6`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetAddonPackageTemplatesResponseSchema, data);
};
