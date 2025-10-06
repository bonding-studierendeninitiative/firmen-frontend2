import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema } from '@schema';
import { createPortraitTemplate } from '@/remote/functions';

export const actions: Actions = {
	createPortrait: async (event) => {
		const form = await superValidate(event.request, valibot(PortraitTemplateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await createPortraitTemplate(form.data);

		return {
			form
		};
	}
};
