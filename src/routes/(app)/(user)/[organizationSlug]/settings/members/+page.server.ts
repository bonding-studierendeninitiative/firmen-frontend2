import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema } from '@schema';

import { PUBLIC_APP_URL } from '$env/static/public';

import { fail } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router';

export const load = async (event) => {
	const { initialState, organization } = await event.parent();
	if (!initialState.sessionId) return;

	const api = await createCaller(event);

	const createInviteForm = await superValidate(valibot(CreateOrgInviteRequestSchema));
	createInviteForm.data.organizationSlug = event.params.organizationSlug;
	createInviteForm.data.redirectURL = PUBLIC_APP_URL;

	return {
		createInviteForm,
		organization: organizationData,
		organizationMembers: await api.organizations.getMembers({
			slug: organization.id
		})
	};
};

export const actions = {
	createInvite: async (event) => {
		const form = await superValidate(event.request, valibot(CreateOrgInviteRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.organizations.generateInvite({
			organizationID: form.data.organizationID,
			role: 'member',
			email: form.data.userMail
		});
		return { form };
	}
};
