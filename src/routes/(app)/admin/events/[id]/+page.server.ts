import { fail, redirect } from '@sveltejs/kit';
import { publishEvent } from '@/services';

export const actions = {
	publishEvent: async ({ params, locals }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}
		await publishEvent({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			eventId: params.id
		});
		redirect(302, `/admin/events`);
	}
};
