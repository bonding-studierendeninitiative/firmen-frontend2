import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { SetOrgDetailsRequestSchema } from '@schema';

import { fail } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router';
import { auth } from '@/auth';

export const load = async (event) => {
	const { session, organization } = await event.parent();
	if (!session?.id) return;

	const api = await createCaller(event);

	async function loadPageData() {
		const editOrganizationDetailsForm = await superValidate(
			JSON.parse(organization.metadata || '{"public": {}}').public,
			valibot(SetOrgDetailsRequestSchema),
			{
				errors: false
			}
		);

		return editOrganizationDetailsForm;
	}

	return {
		editOrganizationDetailsForm: loadPageData(),
		organization,
		orgMembers: await api.orgMembers.getAll({
			offset: '0',
			limit: '10',
			sortBy: 'createdAt',
			sortDirection: 'desc'
		}),
		hasPermission: await auth.api.hasPermission({
			body: {
				organizationId: organization.id,
				permission: {
					organization: ['delete', 'update']
				}
			},
			headers: {
				Authorization: `Bearer ${session.token}`
			}
		})
	};
};

export const actions = {
	updateOrg: async (event) => {
		const form = await superValidate(event.request, valibot(SetOrgDetailsRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.organizations.setDetails(form.data);
		return { form };
	},
	createInvite: async (event) => {
		const form = await superValidate(event.request, valibot(SetOrgDetailsRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.orgMembers.generateInvite({
			role: 'org:member',
			email: form.data.userMail,
			organizationID: form.data.organizationID
		});
		return { form };
	}
};
