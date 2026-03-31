import { object, string, nullish } from 'valibot';
import { orgMemberQuery } from '../auth-guards';
import type { GetActiveEventBuyOptionOutput } from '@api/client';

export const unregisteredEvents = orgMemberQuery(
	object({ cursor: string(), limit: string() }),
	async ({ input: { cursor, limit }, ctx }) => {
		try {
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

export const getPublished = orgMemberQuery(
	object({ page: nullish(string(), '0'), limit: nullish(string(), '4') }),
	async ({ input, ctx }) => {
		try {
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

export const getEventDetails = orgMemberQuery(string(), async ({ input: eventId, ctx }) => {
	return await ctx.api.get('/api/v2/event/{eventId}', { path: { eventId } });
});

export const getActiveBuyOption = orgMemberQuery(string(), async ({ input: eventId, ctx }) => {
	const response = await ctx.api.request('get', '/api/v2/event/{eventId}/active-buy-option', {
		path: { eventId }
	});
	if (response.status === 404) return null;
	return (await response.json()) as GetActiveEventBuyOptionOutput;
});

export const isOrgRegistered = orgMemberQuery(string(), async ({ input: eventId, ctx }) => {
	const response = await ctx.api.get('/api/v2/event/{eventId}/is-registered', {
		path: { eventId },
		query: { organizationId: ctx.session.activeOrganizationId }
	});
	return response;
});
