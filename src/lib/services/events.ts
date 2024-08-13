import { API } from '@api';
import { error } from '@sveltejs/kit';
import * as v from 'valibot';
import {
	type GetEventsResponse,
	type GetEventResponse,
	GetEventsResponseSchema,
	GetEventResponseSchema
} from '@schema';


export const getEvents = async ({ accessToken, status = 'PUBLISHED' }: {
	accessToken: string,
	status: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
}) => {
		const response = await API.get<GetEventsResponse>({
			route: `/events?event_status=${status}&page=0&limit=4`,
			token: accessToken
		});
		const data = await response.json();
		return  v.parse(GetEventsResponseSchema, data).events;
};

export const getEvent = async ({ accessToken, eventId }: {
	accessToken: string,
	eventId: string
}) => {
	const response = await API.get<GetEventResponse>({
		route: `/events/${eventId}`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetEventResponseSchema, data);
};