import { valibot } from 'sveltekit-superforms/adapters';
import { SimpleCreateBuyOptionRequestSchema } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { fail, redirect } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router.js';

export async function load({ params, parent }) {
	const { buyOptionData } = await parent();

	const data = await buyOptionData;

	if (data && Number(data?.totalElements) > 0) {
		redirect(302, `/admin/events/${params.id}/buy-options/${data?.buyOptions[0].id}`);
	}
}

export const actions = {
	createBuyOption: async (event) => {
		const form = await superValidate(event.request, valibot(SimpleCreateBuyOptionRequestSchema));
		
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		const response = await api.admin.events.buyOptions.create({
			data: form.data,
			eventId: event.params.id
		})

		if (response.id) {
			redirect(302, `/admin/events/${event.params.id}/buy-options/${response.id}`);
		}

		return {
			form
		};
	}
};
