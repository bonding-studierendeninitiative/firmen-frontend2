import { getEvent } from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { EventDetailsResponseSchema } from '@schema';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, params }) => {
	const { initialState } = await parent();
	if (!initialState.sessionId) return;

	const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

	const event = await getEvent({
		accessToken: token.jwt,
		eventId: params.id
	});

	const editEventForm = await superValidate(event, valibot(EventDetailsResponseSchema));

	return { event, editEventForm };
};
