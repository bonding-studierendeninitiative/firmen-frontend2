import { getOrganizationDetails, setOrgDetails } from '@/services';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { SetOrgDetailsRequestSchema } from '@schema';

import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params, url }) => {
	const { session } = await parent();
	if (!session?.user) return;
	const organizationData = await getOrganizationDetails({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		slug: params.organizationSlug
	});

	const editOrganizationDetailsForm = await superValidate(
		organizationData,
		valibot(SetOrgDetailsRequestSchema)
	);

	return {
		editOrganizationDetailsForm
	};
};

export const actions: Actions = {
	updateOrg: async ({ locals, request, params }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(SetOrgDetailsRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		await setOrgDetails({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			orgSlug: params.organizationSlug,
			data: form.data
		});
		return { form };
	}
};
