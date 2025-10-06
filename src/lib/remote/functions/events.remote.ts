import { query } from '$app/server';
import { object, string, nullish } from 'valibot';
import { createOrgMemberContext } from '@/remote/context';

export const unregisteredEvents = query(
	object({ cursor: string(), limit: string() }),
	async ({ cursor, limit }) => {
		try {
			const ctx = await createOrgMemberContext();
			const response = await ctx.api.get('/api/v2/event/unregistered', {
				query: {
					organizationId: ctx.session.activeOrganizationId,
					size: Number(limit),
					page: Number(cursor)
				}
			});
			return response;
		} catch (err) {
			console.error(err);
		}
	}
);

export const getPublished = query(
	object({ page: nullish(string(), '0'), limit: nullish(string(), '4') }),
	async (input) => {
		try {
			const ctx = await createOrgMemberContext();

			const response = await ctx.api.get('/api/v2/event/published', {
				query: { page: Number(input.page), size: Number(input.limit) }
			});
			return response;
		} catch (err) {
			console.error(err);
			return { data: [], totalElements: 0, totalPages: 0, pageNumber: 0, pageSize: 10 };
		}
	}
);

export const getEventDetails = query(string(), async (eventId) => {
	const ctx = await createOrgMemberContext();
	const response = await ctx.api.get('/api/v2/event/{eventId}', { path: { eventId } });
	return response;
});

export const getActiveBuyOption = query(string(), async (eventId) => {
	const ctx = await createOrgMemberContext();

	const response = await ctx.api.request('get', '/api/v2/event/{eventId}/active-buy-option', {
		path: { eventId }
	});
	if (response.status === 404) return null;
	return await response.json();
});

export const isOrgRegistered = query(string(), async (eventId) => {
	const ctx = await createOrgMemberContext();

	const response = await ctx.api.get('/api/v2/event/{eventId}/is-registered', {
		path: { eventId },
		query: { organizationId: ctx.session.activeOrganizationId }
	});
	return response;
});
