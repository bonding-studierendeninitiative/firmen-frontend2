import { createCaller } from '@/trpc/router';

export const load = async (event) => {

	const api = await createCaller(event)

	async function loadEvents() {

		return await api.events.getPublished({ page: "0", limit: "10" });
	}

	return { events: event.isDataRequest ? loadEvents() : await loadEvents() };
};
