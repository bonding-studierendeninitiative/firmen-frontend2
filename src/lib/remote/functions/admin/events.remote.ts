import { command, query } from '$app/server';
import { createAdminContext } from '@/remote/context';
import type { Problem } from '@api/client';
import { error } from '@sveltejs/kit';
import { object, optional, string, number, array, union, literal, nullish } from 'valibot';

export const getEvents = query(
	object({
		sortDirection: optional(string()),
		sortBy: optional(string()),
		page: nullish(number(), 0),
		size: nullish(number(), 10),
		status: optional(
			array(union([literal('UNPUBLISHED'), literal('PUBLISHED'), literal('ARCHIVED')])),
			['UNPUBLISHED']
		)
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.get('/api/v2/admin/event', {
			query: {
				event_status: input.status,
				size: input.size,
				page: input.page
			}
		});
		return response;
	}
);

export const getEventDetails = query(
	object({
		eventId: string()
	}),
	async ({ eventId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.api.get('/api/v2/event/{eventId}', {
			path: { eventId }
		});
		return response;
	}
);

export const publishEvent = command(
	object({
		eventId: string()
	}),
	async ({ eventId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request('post', '/api/v2/admin/event/{eventId}/publish', {
			path: { eventId }
		});

		if (response.status !== 204) {
			const problem = (await response.json()) as Problem;
			error(problem.status?.statusCode ?? 500, problem.detail);
		}
	}
);
