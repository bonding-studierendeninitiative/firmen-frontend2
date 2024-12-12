import * as v from 'valibot';

export const APIEvent = v.object({
	id: v.string(),
	name: v.string(),
	projectHSG: v.string(),
	dateFrom: v.string(),
	dateTo: v.nullish(v.string()),
	location: v.string()
});

export const GetEventsResponseSchema = v.object({
	events: v.array(APIEvent),
	totalElements: v.number(),
	totalPages: v.number()
});
export type GetEventsResponse = typeof GetEventsResponseSchema;

export const GetEventResponseSchema = APIEvent;
export type GetEventResponse = typeof GetEventResponseSchema;
