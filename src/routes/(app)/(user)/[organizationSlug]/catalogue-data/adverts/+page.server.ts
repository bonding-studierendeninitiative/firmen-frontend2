import type { PageServerLoad } from './$types';
import { UploadAdvertisementRequest } from '@schema';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { createCaller } from '@/trpc/router';

export const load: PageServerLoad = async (event) => {
	const api = await createCaller(event);

	return {
		advertisementData: api.catalogueData.advertisements.getAll({
			limit: '10',
			cursor: '0'
		})
	};
};

export const actions = {
	uploadAdvertisement: async (event) => {
		const form = await superValidate(event.request, valibot(UploadAdvertisementRequest), {
			strict: true
		});
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		const api = await createCaller(event)

		await api.advertisements.upload({
			...form.data
		});

		return withFiles({ form });
	}
};
