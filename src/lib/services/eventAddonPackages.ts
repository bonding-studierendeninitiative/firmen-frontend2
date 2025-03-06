import * as v from 'valibot';
import { API } from '@api';
import {
	type CreateEventAddonPackageRequest,
	type CreateEventAddonPackageResponse,
	CreateEventAddonPackageResponseSchema,
	type GetEventAddonPackageResponse,
	GetEventAddonPackageResponseSchema,
	type GetEventAddonPackagesResponse,
	GetEventAddonPackagesResponseSchema
} from '@schema/eventAddonPackages';
import { error } from '@sveltejs/kit';
import type { InferInput, InferOutput } from 'valibot';

export const createEventAddonPackage = async ({
	accessToken,
	data: request,
	buyOptionId,
	eventId
}: {
	accessToken: string;
	data: InferOutput<CreateEventAddonPackageRequest>;
	eventId: string;
	buyOptionId: string;
}) => {
	const response = await API.post<InferInput<CreateEventAddonPackageResponse>>({
		route: `/admin/event/${eventId}/buy-option/${buyOptionId}/addon-package`,
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return v.parse(CreateEventAddonPackageResponseSchema, data);
};

export const deleteEventAddonPackage = async ({
	accessToken,
	addonPackageId,
	buyOptionId,
	eventId
}: {
	accessToken: string;
	addonPackageId: string;
	eventId: string;
	buyOptionId: string;
}) => {
	const response = await API.delete({
		route: `/admin/event/${eventId}/buy-option/${buyOptionId}/addon-package/${addonPackageId}`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(404, 'Not Found');
	}
};

export const getEventAddonPackage = async ({
	accessToken,
	addonPackageId
}: {
	accessToken: string;
	addonPackageId: string;
}) => {
	const response = await API.get<InferInput<GetEventAddonPackageResponse>>({
		route: `/admin/addon-package-template/${addonPackageId}`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetEventAddonPackageResponseSchema, data);
};

export const getEventAddonPackages = async ({
	accessToken,
	eventId,
	buyOptionId,
	page = 0
}: {
	accessToken: string;
	page?: number;
	eventId: string;
	buyOptionId: string;
}): Promise<InferOutput<GetEventAddonPackagesResponse>> => {
	const response = await API.get<InferInput<GetEventAddonPackagesResponse>>({
		route: `/admin/event/${eventId}/buy-option/${buyOptionId}/addon-package?page=${page}&limit=6`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetEventAddonPackagesResponseSchema, data);
};
