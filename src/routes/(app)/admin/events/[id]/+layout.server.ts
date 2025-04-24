import { getEvent } from '@/services';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, params }) => {
	const { initialState } = await parent();
	if (!initialState.sessionId) return;

	const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

	const event = getEvent({
		accessToken: token.jwt,
		eventId: params.id
	});

	return { event: event };
};
