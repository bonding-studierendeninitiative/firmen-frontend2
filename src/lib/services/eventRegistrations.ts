import { API } from '@api';
import * as v from 'valibot';

const EventRegistrationSchema = v.object({
	id: v.string(),
	projectHSG: v.nullable(v.string()),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	'resetDay': v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	'comment': v.nullable(v.string()),
	'notizen': v.nullable(v.string()),
	'organizationComment': v.nullable(v.string()),
	'participationNote': v.nullable(v.string()),
	'hasInvoice': v.boolean(),
	'eventName': v.nullable(v.string()),
	'eventLocation': v.nullable(v.string()),
	'notesCategory': v.nullable(v.string()),
	'contactPerson': v.nullable(v.string())
});

const GetEventRegistrationsResponse = v.object({
	eventRegistrations: v.array(EventRegistrationSchema),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export const getEventRegistrations = async ({ accessToken, eventId }: {
	accessToken: string,
	eventId: string,
	status?: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED'
}) => {
	const response = await API.get<v.InferInput<typeof GetEventRegistrationsResponse>>({
		route: `/events/${eventId}/event_registrations?page=0`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetEventRegistrationsResponse, data);
};