import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UpdateUserDetailsRequest } from '@schema';
import { fail, redirect } from '@sveltejs/kit';
import { updateUserMetadata } from '@/services/user';
import type { AuthObject } from 'svelte-clerk/server';

export const load = async ({ parent }) => {
	const { initialState } = await parent();
	if (!initialState?.sessionId) return;

	const form = await superValidate(valibot(UpdateUserDetailsRequest));

	return {
		form
	};
};

export const actions = {
	registerUser: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(UpdateUserDetailsRequest));

		if (!form.valid) {
			return fail(400, { form });
		}

		await updateUserMetadata({
			userId: session.userId,
			data: form.data
		});

		redirect(302, '/');
	}
};
