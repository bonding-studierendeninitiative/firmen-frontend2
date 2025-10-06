import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema } from '@schema';
import { fail } from '@sveltejs/kit';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { identifyOrg, generateInvite } from '@/remote/functions/admin';

export async function load(event) {
	const { session } = await event.parent();
	if (!session?.id) return;

	const organization = await identifyOrg({ slug: event.params.id });

	if (!organization) {
		return {
			organizationId: null,
			is_bondingOrg: false
		};
	}

	const is_bondingOrg = event.params.id === PUBLIC_BONDING_ORG_ID;

	return {
		organizationId: organization?.id,
		is_bondingOrg
	};
}

export const actions = {
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
