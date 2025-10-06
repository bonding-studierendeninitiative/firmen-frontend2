import { createCaller } from '@/trpc/router';

export const load = async (event) => {
	const api = await createCaller(event);

	const eventRegistration = await api.events.isOrgRegistered(event.params.eventId);

	return {
		eventRegistration
	};
};
