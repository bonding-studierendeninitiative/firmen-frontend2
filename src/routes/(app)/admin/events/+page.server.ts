import { getEvents } from '@/services/events';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, isDataRequest }) => {
	const { initialState } = await parent();
	if (!initialState.sessionId) return;

	const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

	console.log(token.jwt);

	return {
		publishedEvents:
			(isDataRequest
				? getEvents({ accessToken: token.jwt, status: 'PUBLISHED' })
				: await getEvents({ accessToken: token.jwt, status: 'PUBLISHED' })) ?? [],
		unpublishedEvents: (await getEvents({ accessToken: token.jwt, status: 'UNPUBLISHED' })) ?? [],
		archivedEvents: (await getEvents({ accessToken: token.jwt, status: 'ARCHIVED' })) ?? []
	};
};
