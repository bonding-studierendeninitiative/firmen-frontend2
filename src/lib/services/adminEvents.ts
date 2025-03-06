import { API } from '@api';
import { error } from '@sveltejs/kit';
import { GetEventRegistrationsForEventResponse } from '@schema';
import { clerkClient } from 'svelte-clerk/server';
import { type InferOutput, parse } from 'valibot';

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

export const getEventRegistrationsForEvent = async ({
	accessToken,
	eventId
}: {
	accessToken: string;
	eventId: string;
	status?: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED';
}) => {
	const response = await API.get<InferOutput<typeof GetEventRegistrationsForEventResponse>>({
		route: `/event/${eventId}/event_registrations?page=0`,
		token: accessToken
	});
	const data = await response.json();
	const { eventRegistrations, totalPages, totalElements, pageNumber, pageSize } = parse(
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
