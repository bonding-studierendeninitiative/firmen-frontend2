import { clerkClient } from 'svelte-clerk/server';
import { getExports } from '@/services';

export async function load({ parent, params }) {
	const { initialState } = await parent();

	if (!initialState || !initialState.sessionId) return;

	const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

	const exports = await getExports({
		accessToken: token.jwt,
		eventId: params.id
	});

	return {
		exports: exports.exports ?? []
	};
}
