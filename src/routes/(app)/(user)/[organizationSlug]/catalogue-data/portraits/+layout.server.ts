import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema } from '@schema';
import { clerkClient } from 'svelte-clerk/server';
import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {
	const page = Number(event.url.searchParams.get('page')) || 0;
	const filter = event.url.searchParams.get('filter') || '';
	const portraitId = event.url.searchParams.get('edit');

	const api = await createCaller(event)

	async function loadPortraitTemplateData() {
		return await api.portraitTemplates.getAll({
			page,
			query: filter
		});
	}

	async function loadPortraitDetails() {
		return await superValidate(valibot(PortraitTemplateSchema));
	}

	return {
		portraitTemplateData: isDataRequest
			? loadPortraitTemplateData()
			: await loadPortraitTemplateData(),
		createForm: isDataRequest ? loadPortraitDetails() : await loadPortraitDetails()
	};
};
