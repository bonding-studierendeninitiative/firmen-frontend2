import { API } from '@api';
import {
	GetBuyOptionsResponseSchema,
	type GetBuyOptionsResponse,
	type UpdateBuyOptionsRequest,
	UpdateBuyOptionsResponseSchema,
	type UpdateBuyOptionsResponse
} from '@schema';
import { parse } from 'valibot';

export const getBuyOptions = async (
	{
		accessToken,
		eventId
	}: {
		accessToken: string;
		eventId: string;
	}) => {
	const response = await API.get<GetBuyOptionsResponse>({
		route: `/events/${eventId}/buy-option?page=0&limit=4&sortBy=createdAt&sortOrder=desc`,
		token: accessToken
	});
	const data = await response.json();
	return parse(GetBuyOptionsResponseSchema, data);
};

export const updateBuyOption = async (
	{
		accessToken,
		eventId,
		data: request
	}: {
		accessToken: string;
		eventId: string;
		data: UpdateBuyOptionsRequest
	}
) => {
	const response = await API.put<UpdateBuyOptionsResponse>({
		route: `/events/${eventId}/buy-option`,
		token: accessToken,
		data: request
	});
	const data = await response.json();
	return parse(UpdateBuyOptionsResponseSchema, data);
};
