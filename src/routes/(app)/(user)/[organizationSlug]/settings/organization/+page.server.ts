import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { SetOrgDetailsRequestSchema } from '@schema';

import { fail } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router.js';

export const load = async ({ parent }) => {
	const { initialState, organization } = await parent();
	if (!initialState.sessionId) return;

	async function loadPageData() {

		const editOrganizationDetailsForm = await superValidate(
			organization.publicMetadata,
			valibot(SetOrgDetailsRequestSchema),
			{
				errors: false
			}
		);

		return editOrganizationDetailsForm;
	}

	return {
		editOrganizationDetailsForm: loadPageData()
	};
};

export const actions = {
	updateOrg: async (event) => {
		const form = await superValidate(event.request, valibot(SetOrgDetailsRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event)

		await api.organizations.setDetails(form.data);
		return { form };
	}
};
