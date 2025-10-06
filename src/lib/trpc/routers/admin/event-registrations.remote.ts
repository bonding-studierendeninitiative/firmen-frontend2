import { command, query } from '$app/server';
import { createAdminContext } from '@/trpc/server';
import { AdminRegisterOrganizationToEventInput } from '@api/admin-client';
import {
	ConfirmEventRegistrationSchema,
	DeleteEventRegistrationSchema,
	RejectEventRegistrationSchema
} from '@schema';
import { nullish, number, object, string } from 'valibot';
import { error } from '@sveltejs/kit';

export const getEventRegistrations = query(
	object({
		eventId: string(),
		cursor: nullish(number(), 0),
		limit: nullish(number(), 10)
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.get('/api/v2/admin/event/{eventId}/event_registrations', {
			path: {
				eventId: input.eventId
			},
			query: {
				page: input.cursor,
				size: input.limit
			}
		});
		const { eventRegistrations, totalPages, totalElements, pageNumber, pageSize } = response;
		return {
			eventRegistrations: await Promise.all(
				(eventRegistrations ?? [])
					.filter((eventRegistration) => eventRegistration.organizationId != undefined)
					.map(async (eventRegistration) => {
						const org = await ctx.db.organization.findUnique({
							where: {
								id: eventRegistration.organizationId
							},
							select: {
								name: true,
								logo: true
							}
						});

						return {
							...eventRegistration,
							organization: {
								name: org?.name,
								address: 'no address found',
								logo: org?.logo
							}
						};
					})
			),
			totalElements,
			totalPages,
			pageNumber,
			pageSize
		};
	}
);

export type GetEventRegistrationsOutput = Awaited<ReturnType<typeof getEventRegistrations>>;
export const confirmEventRegistration = command(
	ConfirmEventRegistrationSchema,
	async ({ eventRegistrationId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/event-registration/{eventRegistrationId}/confirm',
			{
				path: { eventRegistrationId }
			}
		);

		if (response.status !== 204) {
			error(500, 'The registration could not be confirmed');
		}
	}
);
export const rejectEventRegistration = command(
	RejectEventRegistrationSchema,
	async ({ eventRegistrationId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/event-registration/{eventRegistrationId}/reject',
			{
				path: { eventRegistrationId }
			}
		);

		if (response.status !== 204) {
			error(500, 'The registration could not be rejected');
		}
	}
);
export const deleteEventRegistration = command(
	DeleteEventRegistrationSchema,
	async ({ eventRegistrationId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'delete',
			'/api/v2/admin/event-registration/{eventRegistrationId}',
			{
				path: { eventRegistrationId }
			}
		);

		if (response.status !== 200) {
			error(500, 'The registration could not be deleted');
		}
	}
);
export const createEventRegistration = command(
	AdminRegisterOrganizationToEventInput,
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request('post', '/api/v2/admin/event-registration', {
			body: input
		});

		if (response.status === 409) {
			error(409, 'The organization is already registered for this event');
		}

		if (response.status !== 201) {
			error(500, 'The registration could not be created');
		}
	}
);
