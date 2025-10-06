import { ReviewDocumentRequest } from '@schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { reviewDocument } from '@/trpc/routers/admin';

export const actions = {
	reviewDocument: async ({ request }) => {
		const form = await superValidate(request, valibot(ReviewDocumentRequest));

		if (!form.valid) {
			return fail(400, { form });
		}

		await reviewDocument({
			documentId: form.data.documentId,
			data: form.data
		});
	}
};
