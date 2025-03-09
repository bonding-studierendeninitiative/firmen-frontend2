import { API } from '@api';
import * as v from 'valibot';
import type { Infer } from 'sveltekit-superforms';
import { error } from '@sveltejs/kit';
import {
	type CreateEventRegistration,
	CreateEventRegistrationResponse,
	GetEventRegistrationsForOrganizationResponse,
	type GetEventRegistrationsForOrganizationResponse as responseType
} from '@schema';
import { clerkClient } from 'svelte-clerk/server';

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
		const result = v.parse(GetEventRegistrationsForOrganizationResponse, data);
		return {
			...result,
			eventRegistrations: await Promise.all(
				result.eventRegistrations.map(async (eventRegistration) => {
					return {
						...eventRegistration,
						contactPeople: await Promise.all(
							eventRegistration.contactPeople?.map(async (contactPersonId) => {
								const user = await clerkClient.users.getUser(contactPersonId);

								return {
									name: user.fullName,
									image: user.imageUrl,
									email: user.primaryEmailAddress?.emailAddress
								};
							}) ?? []
						)
					};
				})
			)
		};
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
