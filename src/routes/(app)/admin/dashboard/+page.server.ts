import { getAllEvents } from '@/services/adminEvents';
import { clerkClient } from 'svelte-clerk/server';

export async function load({ parent, isDataRequest }) {
	async function loadEvents(status: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED') {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		return (await getAllEvents({ accessToken: token.jwt, status: [status] })) ?? [];
	}

	return {
		publishedEvents: isDataRequest ? loadEvents('PUBLISHED') : await loadEvents('PUBLISHED'),
		unpublishedEvents: isDataRequest ? loadEvents('UNPUBLISHED') : await loadEvents('UNPUBLISHED'),
		archivedEvents: isDataRequest ? loadEvents('ARCHIVED') : await loadEvents('ARCHIVED')
	};
}
