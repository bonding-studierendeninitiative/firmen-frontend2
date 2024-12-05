import { API } from '@api';
import * as v from 'valibot';
import type { Infer } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import {
	type CreateEventRegistration,
	CreateEventRegistrationResponse,
	GetEventRegistrationsForEventResponse, GetEventRegistrationsForOrganizationResponse,
	GetEventRegistrationsForOrganizationResponseType, type OrgEventRegistration, OrgEventRegistrationSchema
} from '@schema';

export const getEventRegistrationsForEvent = async ({
	accessToken,
	eventId
}: {
	accessToken: string;
	eventId: string;
	status?: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
}) => {
	const response = await API.get<v.InferInput<typeof GetEventRegistrationsForEventResponse>>({
		route: `/event/${eventId}/event_registrations?page=0`,
		token: accessToken
	});
	const data = await response.json();
	return v.parse(GetEventRegistrationsForEventResponse, data);
};

export const getEventRegistrationsForOrganization = async ({
	accessToken,
	organizationSlug
}: {
	accessToken: string;
	organizationSlug: string;
}) => {
	const response = await API.get<v.InferInput<typeof GetEventRegistrationsForOrganizationResponse>>(
		{
			route: `/event-registration?organizationId=${organizationSlug}`,
			token: accessToken
		}
	);
	const data = await response.json();
	return v.parse(GetEventRegistrationsForOrganizationResponse, data);
};

export const registerContactPersonToEvent = async ({
	accessToken,
	data: formData
}: {
	accessToken: string;
	data: Infer<CreateEventRegistration>;
}) => {
	const response = await API.post<v.InferInput<CreateEventRegistration>>({
		route: `/event-registration`,
		token: accessToken,
		data: formData
	});

	const data = await response.json();

	if (response.status === 409) {
		error(409, 'A registration to this event already exists for your organization!');
	}
	if (response.status != 201) {
		error(500, 'The registration could not be completed');
	}

	return v.parse(CreateEventRegistrationResponse, data);
};

export const confirmEventRegistration = async ({
	accessToken,
	eventRegistrationId
}: {
	accessToken: string;
	eventRegistrationId: string;
}) => {
	const response = await API.post({
		route: `/event-registration/${eventRegistrationId}/confirm`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(500, 'The registration could not be confirmed');
	}
};

export const rejectEventRegistration = async ({
	accessToken,
	eventRegistrationId
}: {
	accessToken: string;
	eventRegistrationId: string;
}) => {
	const response = await API.post({
		route: `/event-registration/${eventRegistrationId}/reject`,
		token: accessToken
	});

	if (response.status !== 204) {
		error(500, 'The registration could not be rejected');
	}
};
