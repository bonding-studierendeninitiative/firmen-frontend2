import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { UpdatePortraitTemplateRequestSchema } from '@schema';
import { createCaller } from '@/trpc/router';

export const load = async (event) => {
	const api = await createCaller(event);

	return {
		editForm: api.portraitTemplates.editForm(event.params.portraitTemplateId)
	};
};

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

		const api = await createCaller(event);

		await api.portraitTemplates.update({
			data: form.data,
			id: portraitId
		});
	}
};
