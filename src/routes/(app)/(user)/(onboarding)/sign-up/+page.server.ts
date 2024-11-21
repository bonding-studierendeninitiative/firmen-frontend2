import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { ContactPersonRegistrationRequest } from '@schema';
import { type Actions, fail, redirect } from '@sveltejs/kit';
import { registerContactPerson } from '@/services/contactPerson';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const form = await superValidate(valibot(ContactPersonRegistrationRequest));

	return {
		form
	};
};

export const actions: Actions = {
	registerUser: async ({ locals, request }) => {
		const session = await locals.auth();
		console.log("adsasd")
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(ContactPersonRegistrationRequest));

		if (!form.valid) {
			console.log(form)
			return fail(400, { form });
		}

		const registrationResult = await registerContactPerson({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			data: {
				fullName: form.data.fullName,
				phone: form.data.phone,
				position: form.data.position,
				email: form.data.email,
				// @ts-expect-error we define externalUserId in parent
				externalUserId: session.externalUserId
			}
		});

		if (registrationResult) {
			redirect(303, '/');
		}

		return {
			form
		};
	}
};