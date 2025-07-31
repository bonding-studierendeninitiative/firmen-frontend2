import type { PageServerLoad } from './$types';
import { UploadLogoRequest } from '@schema';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { createCaller } from '@/trpc/router';

export const load: PageServerLoad = async (event) => {
	const {organization} = await event.parent()
	const api = await createCaller(event);

	event.depends("orgLogos")

	return {
		data: api.catalogueData.getAll({
			cursor: '0',
			limit: '10',
			documentType: "logo"
		}),
		orgSlug: organization.slug
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

		await api.catalogueData.upload({
			...form.data,
			documentType: "logo"
		});

		return withFiles({ form });
	}
};
