import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {
	const api = await createCaller(event)

	const exports = await api.admin.export.getAll({
		eventId: event.params.id
	});

	return {
		exports: exports.exports ?? []
	};
}
