import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema } from '@schema';
import { createCaller } from '@/trpc/router';

export const actions: Actions = {
	createPortrait: async (event) => {
		const form = await superValidate(event.request, valibot(PortraitTemplateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		
		const api = await createCaller(event);
		
		await api.portraitTemplates.create(form.data);
		
		return {
			form
		};
	}
};
