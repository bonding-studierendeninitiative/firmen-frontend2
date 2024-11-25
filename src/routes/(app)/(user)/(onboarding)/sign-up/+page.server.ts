import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { type ContactPersonDetails, ContactPersonRegistrationRequest } from '@schema';
import { type Actions, error, fail, redirect } from '@sveltejs/kit';
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
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(ContactPersonRegistrationRequest));

		if (!form.valid) {
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
