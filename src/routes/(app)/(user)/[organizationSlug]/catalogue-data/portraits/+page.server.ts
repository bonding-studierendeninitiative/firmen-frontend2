import { type Actions, fail } from '@sveltejs/kit';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema } from '@schema';
import { createPortraitTemplate } from '@/services';

export const actions: Actions = {
	createPortrait: async ({ locals, request, params }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(PortraitTemplateSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await createPortraitTemplate({
			accessToken: token.jwt,
			org: params.organizationSlug ?? '',
			data: form.data
		});
		return {
			form
		};
	}
};
