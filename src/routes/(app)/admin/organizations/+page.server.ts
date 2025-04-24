import { type AuthObject } from 'svelte-clerk/server';
import { error, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgRequestSchema } from '@schema';
import { createOrganization, generateOrgInvite } from '@/services';
import { createCaller } from '@/trpc/router';

export const load = async (event) => {
	const orgsQuery = {
		limit: Number(event.url.searchParams.get('limit') || '10'),
		page: Number(event.url.searchParams.get('page') || '0'),
		query: event.url.searchParams.get('filter') || '',
		orderBy: event.url.searchParams.get('sort')
			? decodeURIComponent(event.url.searchParams.get('sort')!)
			: undefined,
		includeMembersCount: true
	};

	const api = await createCaller(event);

	return {
		orgs: await api.admin.orgs.list(orgsQuery)
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
