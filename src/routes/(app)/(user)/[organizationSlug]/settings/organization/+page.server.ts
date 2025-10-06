import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema, SetOrgDetailsRequestSchema } from '@schema';

import { fail } from '@sveltejs/kit';
import { auth } from '@/auth';
import { generateInvite } from '@/remote/functions/orgMembers.remote.js';
import { setDetails } from '@/remote/functions/organizations.remote.js';

export const load = async (event) => {
	const { session, organization } = await event.parent();
	if (!session?.id) return;

	return {
		organization,
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

		await setDetails({ data: form.data, orgId: event.locals.session.activeOrganizationId! });
		return { form };
	},
	createInvite: async (event) => {
		const form = await superValidate(event.request, valibot(CreateOrgInviteRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await generateInvite({
			role: 'member',
			email: form.data.userMail,
			organizationID: form.data.organizationID
		});
		return { form };
	}
};
