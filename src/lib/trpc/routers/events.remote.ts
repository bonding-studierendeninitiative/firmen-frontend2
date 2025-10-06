import { query } from '$app/server';
import { createContext } from '$lib/trpc/context';
import { getRequestEvent } from '$app/server';
import { object, parse, string, nullish } from 'valibot';
import { apiFetcher } from '@api';
import { createApiClient } from '@api/client';
import { error } from '@sveltejs/kit';

export const unregisteredEvents = query(
	object({ cursor: string(), limit: string() }),
	async ({ cursor, limit }) => {
		try {
			const ctx = await createContext(getRequestEvent());
			const token = await ctx.auth.getToken({
				headers: { Authorization: `Bearer ${ctx.session.token}` }
			});
			const api = createApiClient(
				apiFetcher({ session: ctx.session, token: { jwt: token.token } }),
				process.env.PUBLIC_BACKEND_HOST
			);
			const response = await api.get('/api/v2/event/unregistered', {
				query: { organizationId: ctx.session.orgId, size: Number(limit), page: Number(cursor) }
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
			const ctx = await createContext(getRequestEvent());
			const api = createApiClient(
				apiFetcher({ session: ctx.session }),
				process.env.PUBLIC_BACKEND_HOST
			);
			const response = await api.get('/api/v2/event/published', {
				query: { page: Number(input.page), size: Number(input.limit) }
			});
			return response;
		} catch (err) {
			console.error(err);
			return { events: [], totalElements: 0, totalPages: 0, pageNumber: 0, pageSize: 10 };
		}
	}
);

export const getEventDetails = query(string(), async (eventId) => {
	const ctx = await createContext(getRequestEvent());
	const api = createApiClient(
		apiFetcher({ session: ctx.session }),
		process.env.PUBLIC_BACKEND_HOST
	);
	const response = await api.get('/api/v2/event/{eventId}', { path: { eventId } });
	return response;
});

export const getActiveBuyOption = query(string(), async (eventId) => {
	const ctx = await createContext(getRequestEvent());
	const token = await ctx.auth.getToken({
		headers: { Authorization: `Bearer ${ctx.session.token}` }
	});
	const api = createApiClient(
		apiFetcher({ session: ctx.session, token: { jwt: token.token } }),
		process.env.PUBLIC_BACKEND_HOST
	);
	const response = await api.request('get', '/api/v2/event/{eventId}/active-buy-option', {
		path: { eventId }
	});
	if (response.status === 404) return null;
	return await response.json();
});

export const isOrgRegistered = query(string(), async (eventId) => {
	const ctx = await createContext(getRequestEvent());
	const token = await ctx.auth.getToken({
		headers: { Authorization: `Bearer ${ctx.session.token}` }
	});
	const api = createApiClient(
		apiFetcher({ session: ctx.session, token: { jwt: token.token } }),
		process.env.PUBLIC_BACKEND_HOST
	);
	const response = await api.get('/api/v2/event/{eventId}/is-registered', {
		path: { eventId },
		query: { organizationId: ctx.session.orgId }
	});
	return response;
});
