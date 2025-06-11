import { createCaller } from '@/trpc/router';
import { SubmitPortraitRequest } from '@schema';
import { fail, superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const load = async (event) => {
	const api = await createCaller(event);

	const {organization} = await event.parent()

	const org = await organization;

	return {
		orgId: org.id,
		events: api.events.unregisteredEvents({
			cursor: '0',
			limit: '10'
		}),
		eventRegistrations: api.eventRegistrations.forOrganization({
			orgId: org.id,
			cursor: 0,
			limit: 10
		})
	};
};


export const actions = {
	submitPortrait: async (event) => {

		const form = await superValidate(event.request, valibot(SubmitPortraitRequest));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event)

		await api.eventRegistrations.submitPortrait({
			eventRegistrationId: form.data.eventRegistrationId,
			data: form.data,
		});
	}
}