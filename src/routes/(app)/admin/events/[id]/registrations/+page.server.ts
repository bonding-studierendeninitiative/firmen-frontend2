import { ReviewDocumentRequest } from '@schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {
	const api = await createCaller(event)
	return {
		tableData: api.admin.events.getEventRegistrations({
			eventId: event.params.id,
			cursor: 0,
			limit: 10
		})
	};
};

export const actions = {
	reviewAdvertisement: async (event) => {
		const form = await superValidate(event.request, valibot(ReviewDocumentRequest));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.admin.documents.review({
			documentId: form.data.documentId,
			data: form.data
		});
	},
	reviewLogo: async (event) => {
		const form = await superValidate(event.request, valibot(ReviewDocumentRequest));

		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.admin.documents.review({
			documentId: form.data.documentId,
			data: form.data
		});
	}
};
