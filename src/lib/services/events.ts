import { API } from '@api';
import { parse, type InferInput } from 'valibot';
import {
	type GetEventsResponse,
	GetEventsResponseSchema,
	EventDetailsResponseSchema,
	type EventDetailsResponse
} from '@schema';
import { error } from '@sveltejs/kit';

export const getEvents = async ({
	accessToken,
	status = 'PUBLISHED'
}: {
	accessToken: string;
	status: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
}) => {
	const response = await API.get<InferInput<GetEventsResponse>>({
		route: `/event?event_status=${status}&page=0&limit=4`,
		token: accessToken
	});
	const data = await response.json();
	return parse(GetEventsResponseSchema, data).events;
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

export const publishEvent = async ({
	eventId,
	accessToken
}: {
	eventId: string;
	accessToken: string;
}) => {
	const response = await API.post({
		route: `/event/${eventId}/publish`,
		token: accessToken
	});
	if (response.status !== 204) {
		error(400, response.statusText);
	}
};
