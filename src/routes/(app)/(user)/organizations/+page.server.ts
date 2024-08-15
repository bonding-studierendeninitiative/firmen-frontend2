import type { PageServerLoad } from './$types';
import {
	createOrganization,
	CreateOrganizationRequestSchema,
	getOrgMemberships
} from '$lib/services/organizations';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const form = await superValidate(valibot(CreateOrganizationRequestSchema));

	// @ts-expect-error we define accessToken in parent
	return { form, memberships: await getOrgMemberships({ accessToken: session?.accessToken }) ?? [] };
};

export const actions: Actions = {
	createOrg: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const data = Object.fromEntries(await request.formData());

		await createOrganization({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken, data: CreateOrganizationRequest.parse(data)
		});
	}
};