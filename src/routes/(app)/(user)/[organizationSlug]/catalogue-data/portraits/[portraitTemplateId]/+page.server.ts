import { getPortraitTemplate, updatePortraitDetails } from '@/services/portraitTemplates';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { UpdatePortraitTemplateRequestSchema } from '@schema';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export const load = async ({ params, parent, isDataRequest }) => {
	async function loadPortraitDetails(portraitId: string) {
		const { initialState } = await parent();
		if (!initialState?.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');
		const result = await getPortraitTemplate({
			accessToken: token.jwt,
			portraitTemplateId: portraitId
		});
		return await superValidate(result, valibot(UpdatePortraitTemplateRequestSchema));
	}

	return {
		editForm: isDataRequest
			? loadPortraitDetails(params.portraitTemplateId)
			: await loadPortraitDetails(params.portraitTemplateId)
	};
};

export const actions = {
	editPortrait: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(UpdatePortraitTemplateRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		const portraitId = form.data.id;
		if (!portraitId) {
			return fail(400, { form });
		}

		await updatePortraitDetails({
			accessToken: token.jwt,
			data: form.data,
			id: portraitId
		});
	}
};
