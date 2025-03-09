import { API } from '@api';
import { error } from '@sveltejs/kit';
import {
	AdminEventRegistrationsResponse,
	type GetEventsResponse,
	GetEventsResponseSchema
} from '@schema';
import { clerkClient } from 'svelte-clerk/server';
import { type InferInput, type InferOutput, parse, safeParse } from 'valibot';

export const publishEvent = async ({
	eventId,
	accessToken
}: {
	eventId: string;
	accessToken: string;
}) => {
	const response = await API.post({
		route: `/admin/event/${eventId}/publish`,
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
}) => {
	const response = await API.get<InferOutput<typeof AdminEventRegistrationsResponse>>({
		route: `/admin/event/${eventId}/event_registrations?page=0`,
		token: accessToken
	});
	const data = await response.json();
	const { eventRegistrations, totalPages, totalElements, pageNumber, pageSize } = parse(
		AdminEventRegistrationsResponse,
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

export const getAllEvents = async ({
	accessToken,
	status = ['PUBLISHED'],
	size = '4',
	page = '0'
}: {
	accessToken: string;
	status?: ('PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED')[];
	size?: string;
	page?: string;
}) => {
	try {
		const searchParams = new URLSearchParams();
		searchParams.append('page', page);
		searchParams.append('size', size);
		status.forEach((s) => searchParams.append('event_status', s));
		const response = await API.get<InferInput<GetEventsResponse>>({
			route: `/admin/event?${searchParams}`,
			token: accessToken
		});
		const data = await response.json();
		const parseResult = safeParse(GetEventsResponseSchema, data);
		if (parseResult.success) {
			return parseResult.output;
		} else {
			console.error("Couldn't parse result of getAllEvents:", parseResult.issues);
		}
	} catch (error) {
		console.error(error);
	}
	return {
		data: [],
		status: [],
		totalElements: 0,
		totalPages: 0,
		pageNumber: 0,
		pageSize: 10
	};
};
