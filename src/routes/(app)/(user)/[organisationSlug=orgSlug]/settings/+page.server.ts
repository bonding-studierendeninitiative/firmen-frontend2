import {
	generateOrgInvite,
	getOrganizationDetails,
	getOrganizationMembers,
	setOrgDetails
} from '@/services';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema, SetOrgDetailsRequestSchema } from '@schema';

import {APP_URL} from "$env/static/private"

import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params, url }) => {
	const { session } = await parent();
	if (!session?.user) return;
	const page = Number(url.searchParams.get('page')) || 0;
	const organizationData = await getOrganizationDetails({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		slug: params.organisationSlug
	});

	const createInviteForm = await superValidate(valibot(CreateOrgInviteRequestSchema));
	createInviteForm.data.organizationSlug = params.organisationSlug;
	createInviteForm.data.redirectURL = APP_URL;

	const editOrganizationDetailsForm = await superValidate(
		organizationData,
		valibot(SetOrgDetailsRequestSchema)
	);

	return {
		createInviteForm,
		editOrganizationDetailsForm,
		organization: organizationData,
		organizationMembers: await getOrganizationMembers({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			slug: organizationData.id,
			page: page
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
		await generateOrgInvite({ accessToken: session?.accessToken, data: form.data });
		return { form };
	},
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
			orgSlug: params.organisationSlug,
			data: form.data
		});
		return { form };
	}
};
