import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema } from '@schema';

export const load = async (event) => {
	async function loadPortraitDetails() {
		return await superValidate(valibot(PortraitTemplateSchema));
	}

	return {
		createForm: event.isDataRequest ? loadPortraitDetails() : await loadPortraitDetails()
	};
};
