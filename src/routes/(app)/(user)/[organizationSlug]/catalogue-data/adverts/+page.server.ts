import type { PageServerLoad } from './$types';
import { UploadAdvertisementRequest } from '@schema';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { createCaller } from '@/trpc/router';

export const load: PageServerLoad = async (event) => {
	const api = await createCaller(event);

	event.depends("orgAdverts")

	return {
		advertisementData: api.catalogueData.getAll({
			limit: '10',
			documentType: "advert",
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

		await api.catalogueData.upload({
			...form.data,
			documentType: "advert"
		});

		return withFiles({ form });
	}
};
