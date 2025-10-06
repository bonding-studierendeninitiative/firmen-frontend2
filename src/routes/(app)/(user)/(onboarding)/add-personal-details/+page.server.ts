import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UpdateUserDetailsRequest } from '@schema';
import { fail, redirect } from '@sveltejs/kit';
import { updateMetadata } from '@/remote/functions';

export const load = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.id) return;

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

		await updateMetadata({
			...form.data
		});

		redirect(302, '/');
	}
};
