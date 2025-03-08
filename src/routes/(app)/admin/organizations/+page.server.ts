import { type AuthObject } from 'svelte-clerk/server';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgRequestSchema } from '@schema';
import {
	createOrganization,
	generateOrgInvite,
	getOrgs,
	type OrganizationsQueryData
} from '@/services';

export const load = async ({ url, isDataRequest }) => {
	const orgsQuery: OrganizationsQueryData = {
		limit: Number(url.searchParams.get('limit') || '10'),
		offset: Number(url.searchParams.get('offset') || '0'),
		query: url.searchParams.get('filter') || '',
		orderBy: url.searchParams.get('sort')
			? decodeURIComponent(url.searchParams.get('sort')!)
			: undefined
	};

	async function loadOrganizationData(queryData: OrganizationsQueryData) {
		const organizations = await getOrgs(queryData);

		return {
			organizations
		};
	}

	const createForm = superValidate(valibot(CreateOrgRequestSchema));

	return {
		createForm: isDataRequest ? createForm : await createForm,
		organizationInfo: isDataRequest
			? loadOrganizationData(orgsQuery)
			: await loadOrganizationData(orgsQuery)
	};
};

export const actions = {
	createOrg: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(CreateOrgRequestSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const organization = await createOrganization({ name: form.data.name });

		if (!organization) {
			return error(500, 'Could not create organization');
		}

		const orgInvite = await generateOrgInvite({
			organizationID: organization.id,
			role: 'org:admin',
			email: form.data.ownerMail
		});
		if (!orgInvite) {
			return error(500, 'Could not create invite');
		}
		return { form };
	}
};
