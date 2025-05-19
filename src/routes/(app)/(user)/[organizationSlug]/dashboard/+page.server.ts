import { createCaller } from '@/trpc/router';

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
