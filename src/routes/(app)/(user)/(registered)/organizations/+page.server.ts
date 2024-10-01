import type { PageServerLoad } from './$types';
import { createOrganization, getOrgMemberships } from '@/services/organizations';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrganizationRequestSchema } from '@schema/createOrganization';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const form = await superValidate(valibot(CreateOrganizationRequestSchema));

	return {
		form,
		// @ts-expect-error we define accessToken in parent
		memberships: (await getOrgMemberships({ accessToken: session?.accessToken })) ?? []
	};
};

export const actions: Actions = {
	createOrg: async ({ locals, request }) => {
		console.log('start');
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(CreateOrganizationRequestSchema));

		if (!form.valid) {
			console.log('asdas');
			return fail(400, { form });
		}

		await createOrganization({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			data: form.data
		});

		return {
			form
		};
	}
};
