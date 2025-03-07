import type {
	PageServerLoad, Actions
} from './$types';
import { generateOrgInvite, getOrganizationMembers, type MembershipQueryData } from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { PUBLIC_APP_URL } from '$env/static/public';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema } from '@schema';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params, isDataRequest, url , depends}) => {

	depends("app:orgData")

	const membershipQueryData: MembershipQueryData = {
		id: null,
		limit: Number(url.searchParams.get('limit') || "25"),
		query: url.searchParams.get('filter') || "",
		offset: Number(url.searchParams.get('page') || "0") * Number(url.searchParams.get('limit') || "10"),
		orderBy: url.searchParams.get('sort') ? decodeURIComponent(url.searchParams.get('sort')!) : undefined
	}


	async function loadOrgData(queryData: MembershipQueryData) {
		const { initialState,organizationDetails } = await parent();
		if (!initialState.sessionId) return;

		const details = await organizationDetails;
		const organization = details.organization

		queryData.id = organization.id;
		const orgMembers = await getOrganizationMembers(queryData);

		const createInviteForm = await superValidate(
			{
				organizationID: organization.id,
				redirectURL: PUBLIC_APP_URL
			},
			valibot(CreateOrgInviteRequestSchema), {errors: false}
		);

		return {
			orgMembers,
			createInviteForm
		}
	}

	return {
		orgData: isDataRequest ? loadOrgData(membershipQueryData) : await loadOrgData(membershipQueryData),
	}

}


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

		await generateOrgInvite({ role: "org:member", email: form.data.userMail, organizationID: form.data.organizationID });
		return { form };
	}
};
