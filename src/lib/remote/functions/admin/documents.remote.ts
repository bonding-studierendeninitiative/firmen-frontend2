import { command, query } from '$app/server';
import { createAdminContext } from '@/remote/context';
import { nonEmpty, object, pipe, string } from 'valibot';
import { ReviewDocumentRequest } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { error } from '@sveltejs/kit';

export const reviewDocument = command(
	object({
		documentId: pipe(string(), nonEmpty()),
		data: ReviewDocumentRequest
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/registration-document/{registrationDocumentId}/review',
			{
				path: { registrationDocumentId: input.documentId },
				body: input.data
			}
		);

		if (response.status !== 200) {
			error(500, 'The review was not acknowledged');
		}

		return response;
	}
);

export const reviewDocumentForm = query(object({}), async () => {
	return await superValidate(valibot(ReviewDocumentRequest), {
		id: 'reviewDocumentForm'
	});
});
