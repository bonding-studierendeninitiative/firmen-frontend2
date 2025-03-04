import { fail, redirect } from '@sveltejs/kit';
import { publishEvent } from '@/services';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export function load({ params }) {
	redirect(302, `/admin/events/${params.id}/registrations`);
}

export const actions = {
	publishEvent: async ({ params, locals }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await publishEvent({
			accessToken: token.jwt,
			eventId: params.id
		});
		redirect(302, `/admin/events`);
	}
};
