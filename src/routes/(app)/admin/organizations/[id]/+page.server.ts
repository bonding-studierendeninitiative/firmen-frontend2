import type { Actions, PageServerLoad } from './$types';
import {
	generateOrgInvite,
	getEventRegistrationsForOrganization,
	getOrganizationMembers,
	getPortraitTemplates
} from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema } from '@schema';
import { PUBLIC_APP_URL } from '$env/static/public';
import { fail } from '@sveltejs/kit';
import { clerkClient, type AuthObject } from 'svelte-clerk/server';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { initialState, organizations } = await parent();
	if (!initialState.sessionId) return;

	const organization = organizations?.find((org) => org.slug === params.id) || {};

	const orgMembers = await getOrganizationMembers({ slug: organization.id });

	const createInviteForm = await superValidate(
		{
			organizationSlug: organization.slug || initialState.orgId,
			redirectURL: PUBLIC_APP_URL
		},
		valibot(CreateOrgInviteRequestSchema)
	);

	const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

	const { portraitTemplates } = await getPortraitTemplates({
		accessToken: token.jwt,
		org: params.id
	});

	const { eventRegistrations } = await getEventRegistrationsForOrganization({
		accessToken: token.jwt,
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
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateOrgInviteRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await generateOrgInvite({ accessToken: token.jwt, data: form.data });
		return { form };
	}
};
