import { API } from '@api';
import { parse, type InferInput } from 'valibot';
import {
	type GetEventsResponse,
	GetEventsResponseSchema,
	EventDetailsResponseSchema,
	type EventDetailsResponse,
	type GetBuyOptionResponse,
	GetBuyOptionResponseSchema
} from '@schema';

export const getPublishedEvents = async ({
	accessToken,
	page = '0',
	limit = '4'
}: {
	accessToken: string;
	page?: string;
	limit?: string;
}) => {
	try {
		const searchParams = new URLSearchParams();
		searchParams.append('page', page);
		searchParams.append('limit', limit);
		const response = await API.get<InferInput<GetEventsResponse>>({
			route: `/event/published?${searchParams}`,
			token: accessToken
		});
		const data = await response.json();
		console.log(data);
		return parse(GetEventsResponseSchema, data);
	} catch (error) {
		console.error(error);
		return {
			events: [],
			totalElements: 0,
			totalPages: 0,
			pageNumber: 0,
			pageSize: 10
		};
	}
};

export const getUnregisteredEvents = async ({
	accessToken,
	organizationId,
	page = '0',
	limit = '4'
}: {
	accessToken: string;
	organizationId: string;
	page?: string;
	limit?: string;
}) => {
	const searchParams = new URLSearchParams({
		page,
		limit,
		organizationId
	});

	const response = await API.get<InferInput<GetEventsResponse>>({
		route: `/event/unregistered?${searchParams}`,
		token: accessToken
	});
	const data = await response.json();
	return parse(GetEventsResponseSchema, data).data;
};

export const getEvent = async ({
	accessToken,
	eventId
}: {
	accessToken: string;
	eventId: string;
}) => {
	const response = await API.get<InferInput<EventDetailsResponse>>({
		route: `/event/${eventId}`,
		token: accessToken
	});

	const data = await response.json();
	return parse(EventDetailsResponseSchema, data);
};

export const getActiveBuyOption = async ({
	accessToken,
	eventId
}: {
	accessToken: string;
	eventId: string;
}) => {
	const response = await API.get<InferInput<GetBuyOptionResponse>>({
		route: `/event/${eventId}/active-buy-option`,
		token: accessToken
	});
	const data = await response.json();
	return parse(GetBuyOptionResponseSchema, data);
};
