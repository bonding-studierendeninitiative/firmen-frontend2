import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {
	const api = await createCaller(event);
	return {
		buyOptionData: api.admin.events.buyOptions.getAll({
			eventId: event.params.id,
			page: '0',
			limit: '10',
			sortBy: 'creationDate',
			sortDirection: 'desc'
		})
	};
};
