import type { Actions, PageServerLoad } from './$types';
import { createOrganization, getOrgMemberships } from '$lib/services/organizations';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrganizationRequestSchema } from '@schema/createOrganization';
import { fail, redirect } from '@sveltejs/kit';
import { getContactPersonDetails } from '@/services/contactPerson';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const form = await superValidate(valibot(CreateOrganizationRequestSchema));

	return {
		form,
	};
};

export const actions: Actions = {
	createOrg: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(CreateOrganizationRequestSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const createdOrg = await createOrganization({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			data: form.data
		});

		// need to refresh store, so that the user is not forced to create new organization
		await getContactPersonDetails({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
		})

		if (createdOrg.slug) {
			redirect(303, `/${createdOrg.slug}`);
		}

		return {
			form,
			organization: createdOrg
		};
	}
};
