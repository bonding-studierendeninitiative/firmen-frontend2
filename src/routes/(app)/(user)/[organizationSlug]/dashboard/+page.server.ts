import { createCaller } from '@/trpc/router';

export const load = async (event) => {
	const api = await createCaller(event);

	return {
		events: api.events.unregisteredEvents({
			cursor: '0',
			limit: '10'
		}),
		eventRegistrations: api.eventRegistrations.forOrganization({
			cursor: '0',
			limit: '10'
		})
	};
};
