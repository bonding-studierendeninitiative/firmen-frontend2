import * as v from 'valibot';

const APIEvent = v.object({
	id: v.string(),
	name: v.string(),
	projectHSG: v.string(),
	dateFrom: v.nullable(v.string()),
	dateTo: v.nullable(v.string()),
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
