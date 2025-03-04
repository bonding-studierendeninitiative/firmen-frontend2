import type { PageServerLoad } from './$types';
import { getEvents } from '@/services';
import { clerkClient } from 'svelte-clerk/server';

export const load: PageServerLoad = async ({ parent, isDataRequest }) => {
	async function loadEvents() {
		const { initialState } = await parent();

		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		return await getEvents({ accessToken: token.jwt });
	}

	return { events: isDataRequest ? loadEvents() : await loadEvents() };
};
