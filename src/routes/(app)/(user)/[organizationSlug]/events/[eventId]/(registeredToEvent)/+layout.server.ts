import { isOrgRegistered } from '@/remote/functions/events.remote.js';

export const load = async (event) => {
	const eventRegistration = await isOrgRegistered(event.params.eventId);

	return {
		eventRegistration
	};
};
