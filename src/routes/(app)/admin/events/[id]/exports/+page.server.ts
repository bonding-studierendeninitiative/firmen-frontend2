import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {
	const api = await createCaller(event)

	const exports = api.admin.export.getAll({
		eventId: event.params.id,
		page: Number(event.url.searchParams.get("page") ?? 0),
		limit: Number(event.url.searchParams.get("limit") ?? 10)
	});

	return {
		exports,
		eventId: event.params.id
	};
}
