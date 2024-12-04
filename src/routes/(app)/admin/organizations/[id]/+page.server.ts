import type { Actions, PageServerLoad } from './$types';
import {
	generateOrgInvite,
	getEventRegistrationsForOrganization,
	getOrganizationDetails,
	getOrganizationMembers,
	getPortraitTemplates
} from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema } from '@schema';
import { APP_URL } from '$env/static/private';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const orgMembers = await getOrganizationMembers({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		slug: params.id
	});

	const organization = await getOrganizationDetails({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		slug: params.id
	});

	const createInviteForm = await superValidate(valibot(CreateOrgInviteRequestSchema));
	createInviteForm.data.organizationSlug = organization.slug;
	createInviteForm.data.redirectURL = APP_URL;

	const { portraitTemplates } = await getPortraitTemplates({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		org: params.id
	});

	const { eventRegistrations } = await getEventRegistrationsForOrganization({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		organizationSlug: params.id
	});

	return {
		orgMembers,
		createInviteForm,
		organization,
		portraitTemplates,
		eventRegistrations
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
	}
};
