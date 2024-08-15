import { API } from '@api';
import * as v from 'valibot';

export const EventRegistrationSchema = v.object({
	id: v.string(),
	createdAt: v.pipe(v.string(), v.isoTimestamp()),
	modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	organizationComment: v.nullable(v.string()),
	participationNote: v.nullable(v.string()),
	contactPerson: v.object({
		fullName: v.nullish(v.string()),
		phone: v.nullish(v.string()),
		email: v.nullish(v.string())
	}),
	organization: v.object({
		name: v.nullish(v.string()),
		phone: v.nullish(v.string()),
		email: v.nullish(v.string())
	}),
	status: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	portraitStatus: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	logoStatus: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	),
	advertisementStatus: v.nullish(
		v.object({
			code: v.number(),
			text: v.string()
		})
	)
});

export type EventRegistration = typeof EventRegistrationSchema;

const GetEventRegistrationsResponse = v.object({
	eventRegistrations: v.array(EventRegistrationSchema),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export const getEventRegistrations = async ({
	accessToken,
	eventId
}: {
	accessToken: string;
	eventId: string;
	status?: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
}) => {
	const response = await API.get<v.InferInput<typeof GetEventRegistrationsResponse>>({
		route: `/events/${eventId}/event_registrations?page=0`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetEventRegistrationsResponse, data);
};
