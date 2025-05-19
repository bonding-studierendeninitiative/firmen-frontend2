import { ReviewAdvertisementRequest, ReviewLogoRequest } from '@schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {
	const api = await createCaller(event)
	return {
		tableData: api.admin.events.getEventRegistrations({
			eventId: event.params.id
		})
	};
};

export const actions = {
	reviewAdvertisement: async (event) => {
		const form = await superValidate(event.request, valibot(ReviewAdvertisementRequest));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.admin.advertisements.review({
			advertisementId: form.data.advertisementId,
			data: form.data
		});
	},
	reviewLogo: async (event) => {
		const form = await superValidate(event.request, valibot(ReviewLogoRequest));

		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.admin.logos.review({
			logoId: form.data.logoId,
			data: form.data
		});
	}
};
