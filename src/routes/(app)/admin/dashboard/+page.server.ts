import { createCaller } from '@/trpc/router.js';

export async function load(event) {

	const api = await createCaller(event)

	async function loadEvents(status: 'PUBLISHED' | 'UNPUBLISHED' | 'ARCHIVED') {
		return (await api.admin.events.getAll({ event_status: [status] })) ?? [];
	}

	return {
		publishedEvents: event.isDataRequest ? loadEvents('PUBLISHED') : await loadEvents('PUBLISHED'),
		unpublishedEvents: event.isDataRequest ? loadEvents('UNPUBLISHED') : await loadEvents('UNPUBLISHED'),
		archivedEvents: event.isDataRequest ? loadEvents('ARCHIVED') : await loadEvents('ARCHIVED')
	};
}
