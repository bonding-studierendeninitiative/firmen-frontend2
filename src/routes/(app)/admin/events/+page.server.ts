import { createCaller } from '@/trpc/router';
import { clerkClient } from 'svelte-clerk/server';

export const load = async (event) => {
	const status = event.url.searchParams.getAll('status').map((status) => status.toUpperCase()) ?? [
		'PUBLISHED'
	];
	const size = Number(event.url.searchParams.get('size') ?? '10');
	const page = Number(event.url.searchParams.get('page') ?? '0');

	const api = await createCaller(event)

	async function loadEvents({
		size,
		page,
		status
	}: {
		status: string[];
		size: number;
		page: number;
	}) {
		const { initialState } = await event.parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');
		return await api.admin.events.getAll({ event_status: status, size, page });
	}

	return {
		events:
			(event.isDataRequest
				? loadEvents({ status, size, page })
				: await loadEvents({ status, page, size })) ?? []
	};
};
