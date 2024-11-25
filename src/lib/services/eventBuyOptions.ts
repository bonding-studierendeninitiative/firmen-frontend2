import { API } from '@api';
import {
	GetBuyOptionsResponseSchema,
	type GetBuyOptionsResponse,
	type UpdateBuyOptionsRequest,
	UpdateBuyOptionsResponseSchema,
	type UpdateBuyOptionsResponse,
	type GetBuyOptionResponse,
	type UpdateBuyOptionRequest,
	GetBuyOptionResponseSchema,
	type CreateBuyOptionRequest
} from '@schema';
import { type InferInput, type InferOutput, parse } from 'valibot';
import { error } from '@sveltejs/kit';

export const getBuyOptions = async ({
	accessToken,
	eventId
}: {
	accessToken: string;
	eventId: string;
}) => {
	const response = await API.get<InferInput<GetBuyOptionsResponse>>({
		route: `/event/${eventId}/buy-option?page=0&limit=4&sortBy=createdAt&sortOrder=desc`,
		token: accessToken
	});
	const data = await response.json();
	return parse(GetBuyOptionsResponseSchema, data);
};

export const getBuyOption = async ({
	accessToken,
	eventId,
	buyOptionId
}: {
	accessToken: string;
	eventId: string;
	buyOptionId: string;
}) => {
	const response = await API.get<InferInput<GetBuyOptionResponse>>({
		route: `/event/${eventId}/buy-option/${buyOptionId}`,
		token: accessToken
	});
	const data = await response.json();
	return parse(GetBuyOptionResponseSchema, data);
};

export const getActiveBuyOption = async ({
	accessToken,
	eventId
}: {
	accessToken: string;
	eventId: string;
}) => {
	const response = await API.get<InferInput<GetBuyOptionResponse>>({
		route: `/event/${eventId}/buy-option/active`,
		token: accessToken
	});
	const data = await response.json();
	return parse(GetBuyOptionResponseSchema, data);
};

export const deleteBuyOption = async ({
	accessToken,
	eventId,
	buyOptionId
}: {
	accessToken: string;
	eventId: string;
	buyOptionId: string;
}) => {
	const response = await API.delete({
		route: `/event/${eventId}/buy-option/${buyOptionId}`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(404, 'Not Found');
	}
};

export const updateBuyOptions = async ({
	accessToken,
	eventId,
	data: request
}: {
	accessToken: string;
	eventId: string;
	data: InferOutput<UpdateBuyOptionsRequest>;
}) => {
	const response = await API.put<InferInput<UpdateBuyOptionsResponse>>({
		route: `/event/${eventId}/buy-option`,
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return parse(UpdateBuyOptionsResponseSchema, data);
};

export const updateBuyOption = async ({
	accessToken,
	eventId,
	buyOptionId,
	data: request
}: {
	accessToken: string;
	eventId: string;
	buyOptionId: string;
	data: InferOutput<UpdateBuyOptionRequest>;
}) => {
	const response = await API.put<InferInput<GetBuyOptionResponse>>({
		route: `/event/${eventId}/buy-option/${buyOptionId}`,
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return parse(GetBuyOptionResponseSchema, data);
};

export const createBuyOption = async ({
	accessToken,
	eventId,
	data: request
}: {
	accessToken: string;
	eventId: string;
	data: InferInput<CreateBuyOptionRequest>;
}) => {
	const response = await API.post<GetBuyOptionResponse>({
		route: `/event/${eventId}/buy-option`,
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return parse(GetBuyOptionResponseSchema, data);
};

export const activateBuyOption = async ({
	eventId,
	buyOptionId,
	accessToken
}: {
	eventId: string;
	accessToken: string;
	buyOptionId: string;
}) => {
	const response = await API.post({
		route: `/event/${eventId}/buy-option/${buyOptionId}/activate`,
		token: accessToken
	});
	if (response.status !== 204 && response.status !== 200) {
		error(400, 'Bad Request');
	}
};
