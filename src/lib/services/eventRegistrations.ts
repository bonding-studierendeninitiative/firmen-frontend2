import { API } from '@api';
import * as v from 'valibot';
import type { Infer } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import {
	type CreateEventRegistration,
	CreateEventRegistrationResponse,
	GetEventRegistrationsForEventResponse,
	GetEventRegistrationsForOrganizationResponse,
	type GetEventRegistrationsForOrganizationResponse as responseType
} from '@schema';
import { clerkClient } from 'svelte-clerk/server';

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
	const { eventRegistrations, totalPages, totalElements, pageNumber, pageSize } = v.parse(
		GetEventRegistrationsForEventResponse,
		data
	);
	return {
		eventRegistrations: await Promise.all(
			eventRegistrations.map(async (eventRegistration) => {
				const org = await clerkClient.organizations.getOrganization({
					organizationId: eventRegistration.organizationId
				});

				return {
					...eventRegistration,
					organization: {
						name: org.name,
						address: 'no address found',
						logo: org.imageUrl
					}
				};
			})
		),
		totalElements,
		totalPages,
		pageNumber,
		pageSize
	};
};

export const getEventRegistrationsForOrganization = async ({
	accessToken,
	organizationSlug,
	page = '0',
	limit = '4'
}: {
	accessToken: string;
	organizationSlug: string;
	page?: string;
	limit?: string;
}) => {
	const searchParams = new URLSearchParams({
		page,
		limit,
		organizationId: organizationSlug
	});
	try {
		const response = await API.get<v.InferInput<responseType>>({
			route: `/event-registration?${searchParams}`,
			token: accessToken
		});
		const data = await response.json();
		console.log(data);
		return v.parse(GetEventRegistrationsForOrganizationResponse, data);
	} catch (error) {
		console.error(error);
		return {
			eventRegistrations: [],
			totalElements: 0,
			totalPages: 0,
			pageNumber: 0,
			pageSize: 10
		};
	}
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
