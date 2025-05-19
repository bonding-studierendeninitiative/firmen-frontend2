import type { PageServerLoad } from './$types';
import { UploadLogoRequest } from '@schema';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { createCaller } from '@/trpc/router';

export const load: PageServerLoad = async (event) => {
	const api = await createCaller(event);

	return {
		data: api.catalogueData.logos.getAll({
			cursor: '0',
			limit: '10'
		})
	};
};

export const actions = {
	uploadLogo: async (event) => {

		const form = await superValidate(event.request, valibot(UploadLogoRequest), {
			strict: true
		});
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		const api = await createCaller(event)

		await api.catalogueData.logos.upload({
			...form.data
		});

		return withFiles({ form });
	}
};
