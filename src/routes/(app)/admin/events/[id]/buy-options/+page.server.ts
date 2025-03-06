import { createBuyOption } from '@/services';
import { valibot } from 'sveltekit-superforms/adapters';
import { SimpleCreateBuyOptionRequestSchema } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export async function load({ params, parent }) {
	const { buyOptionData } = await parent();

	const data = await buyOptionData;

	if (data && data?.totalElements > 0) {
		redirect(302, `/admin/events/${params.id}/buy-options/${data?.buyOptions[0].id}`);
	}
}

export const actions = {
	createBuyOption: async ({ locals, request, params }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(SimpleCreateBuyOptionRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		const response = await createBuyOption({
			accessToken: token.jwt,
			data: form.data,
			eventId: params.id
		});

		if (response.id) {
			redirect(302, `/admin/events/${params.id}/buy-options/${response.id}`);
		}

		return {
			form
		};
	}
};
