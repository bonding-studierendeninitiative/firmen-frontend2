import { createCaller } from '@/trpc/router';

export const load = async (event) => {

	const api = await createCaller(event)

	async function loadEventDetails(eventId: string, orgSlug: string) {
		const eventDetails = await api.events.getDetails(eventId);

		const buyOption = await api.events.getActiveBuyOption(eventId);

		return {
			event: eventDetails,
			buyOption,
			orgSlug
		};
	}

	return {
		eventDetails: event.isDataRequest
			? loadEventDetails(event.params.eventId, event.params.organizationSlug)
			: await loadEventDetails(event.params.eventId, event.params.organizationSlug)
	};
};
