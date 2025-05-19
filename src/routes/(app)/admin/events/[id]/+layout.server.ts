import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {
	const api = await createCaller(event)

	const eventDetails = api.events.getDetails(event.params.id);

	return { event: eventDetails };
};
