import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UpdateUserDetailsRequest } from '@schema';
import { fail, redirect } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router.js';

export const load = async ({ parent }) => {
	const { initialState } = await parent();
	if (!initialState?.sessionId) return;

	const form = await superValidate(valibot(UpdateUserDetailsRequest));

	return {
		form
	};
};

export const actions = {
	registerUser: async (event) => {
		const form = await superValidate(event.request, valibot(UpdateUserDetailsRequest));

		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event)

		await api.user.updateMetadata({
			...form.data
		});

		redirect(302, '/');
	}
};
