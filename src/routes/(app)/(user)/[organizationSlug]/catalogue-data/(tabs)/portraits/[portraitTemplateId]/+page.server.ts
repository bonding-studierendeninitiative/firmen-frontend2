import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { UpdatePortraitTemplateRequestSchema } from '@schema';
import { updatePortraitTemplate } from '@/remote/functions/portraitTemplates.remote.js';

export const actions = {
	editPortrait: async (event) => {
		const form = await superValidate(event.request, valibot(UpdatePortraitTemplateRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const portraitId = form.data.id;
		if (!portraitId) {
			return fail(400, { form });
		}

		await updatePortraitTemplate({
			data: form.data,
			id: portraitId
		});
	}
};
