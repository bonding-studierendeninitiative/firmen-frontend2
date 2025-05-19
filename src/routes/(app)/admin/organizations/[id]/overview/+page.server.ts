import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema } from '@schema';
import { fail } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router';
import { makeSerializable } from '@/utils';

export const load = async (event) => {

	const membershipQueryData = {
		limit: Number(event.url.searchParams.get('limit') || '25'),
		page: Number(event.url.searchParams.get('page') || '0'),
		orderBy: event.url.searchParams.get('sort')
			? decodeURIComponent(event.url.searchParams.get('sort')!)
			: undefined
	};

	const { initialState, organizationDetails } = await event.parent();
	if (!initialState.sessionId) return;

	const details = await organizationDetails;
	const organization = details.organization;

	const api = await createCaller(event)


	return {
		organizationId: organization.id,
		orgMembers: makeSerializable(await api.admin.orgs.members.getAll({
			organizationId: organization.id,
			limit: membershipQueryData.limit,
			page: membershipQueryData.page,
			sort: membershipQueryData.orderBy
		}))
	}

};

export const actions = {
	createInvite: async (event) => {

		const form = await superValidate(event.request, valibot(CreateOrgInviteRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.organizations.generateInvite({
			role: 'org:member',
			email: form.data.userMail,
			organizationID: form.data.organizationID
		});
		return { form };
	}
};
