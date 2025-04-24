import { getPortraitTemplates } from '@/services/portraitTemplates';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema } from '@schema';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, url, isDataRequest }) => {
	const page = Number(url.searchParams.get('page')) || 0;
	const filter = url.searchParams.get('filter') || '';
	const portraitId = url.searchParams.get('edit');

	async function loadPortraitTemplateData() {
		const { initialState, organization } = await parent();
		if (!initialState?.sessionId) return;

		const org = await organization;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		return await getPortraitTemplates({
			accessToken: token.jwt,
			org: org.id,
			page,
			filter
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
