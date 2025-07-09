import { createCaller } from '@/trpc/router';

export async function load(event) {
	const api = await createCaller(event);

	return {
		document: await api.catalogueData.getDocument({
			documentId: event.params.documentId
		})
	};
};