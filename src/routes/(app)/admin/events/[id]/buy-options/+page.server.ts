import { createBuyOption } from '$lib/services';
import { valibot } from 'sveltekit-superforms/adapters';
import { SimpleCreateBuyOptionRequestSchema } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';

export const actions = {
	createBuyOption: async ({ locals, request, params }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(SimpleCreateBuyOptionRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const response = await createBuyOption({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
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
