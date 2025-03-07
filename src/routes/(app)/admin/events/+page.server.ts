import { getAllEvents } from '@/services/adminEvents';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, isDataRequest, url }) => {
	const status = url.searchParams.getAll('status').map((status) => status.toUpperCase()) ?? [
		'PUBLISHED'
	];
	const size = url.searchParams.get('size') ?? '10';
	const page = url.searchParams.get('page') ?? '0';

	async function loadEvents({
		size,
		page,
		status
	}: {
		status: string[];
		size: string;
		page: string;
	}) {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');
		return await getAllEvents({ accessToken: token.jwt, status, size, page });
	}

	return {
		events:
			(isDataRequest
				? loadEvents({ status, size, page })
				: await loadEvents({ status, page, size })) ?? []
	};
};
