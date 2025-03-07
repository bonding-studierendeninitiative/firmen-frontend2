import { generateOrgInvite, getOrganizationDetails, getOrganizationMembers } from '@/services';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema } from '@schema';

import { PUBLIC_APP_URL } from '$env/static/public';

import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { initialState } = await parent();
	if (!initialState.sessionId) return;

	const organizationData = await getOrganizationDetails({
		slug: params.organizationSlug
	});

	const createInviteForm = await superValidate(valibot(CreateOrgInviteRequestSchema));
	createInviteForm.data.organizationSlug = params.organizationSlug;
	createInviteForm.data.redirectURL = PUBLIC_APP_URL;

	return {
		createInviteForm,
		organization: organizationData,
		organizationMembers: await getOrganizationMembers({
			slug: organizationData.id
		})
	};
};

export const actions: Actions = {
	createInvite: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateOrgInviteRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		// @ts-expect-error  we define accessToken in parent
		await generateOrgInvite({
			organizationID: form.data.organizationID,
			role: "org:member",
			email: form.data.userMail
		});
		return { form };
	}
};
