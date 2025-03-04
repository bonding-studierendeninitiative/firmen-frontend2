import { setOrgDetails } from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { SetOrgDetailsRequestSchema } from '@schema';

import { fail } from '@sveltejs/kit';
import type { AuthObject } from 'svelte-clerk/server';

export const load = async ({ parent }) => {
	const { initialState, organization } = await parent();
	if (!initialState.sessionId) return;

	async function loadPageData() {
		const org = await organization;

		const editOrganizationDetailsForm = await superValidate(
			org.publicMetadata,
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
	updateOrg: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;

		if (!session || !session.orgId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(SetOrgDetailsRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		await setOrgDetails({
			orgId: session.orgId,
			data: form.data
		});
		return { form };
	}
};
