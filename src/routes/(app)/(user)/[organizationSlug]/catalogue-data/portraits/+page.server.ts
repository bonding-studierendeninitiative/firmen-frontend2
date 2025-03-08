import type { PageServerLoad } from './$types';
import {
	createPortraitTemplate,
	getPortraitTemplates,
	deletePortraitTemplate
} from '@/services/portraitTemplates';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { PortraitTemplateSchema, DeletePortraitTemplateRequestSchema } from '@schema';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export const load: PageServerLoad = async ({ parent, url, isDataRequest }) => {
	const form = superValidate(valibot(PortraitTemplateSchema));

	const page = Number(url.searchParams.get('page')) || 0;

	async function loadPortraitTemplateData() {
		const { initialState, organization } = await parent();
		if (!initialState?.sessionId) return;

		const deleteForm = await superValidate(valibot(DeletePortraitTemplateRequestSchema));

		const org = await organization;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const result = await getPortraitTemplates({
			accessToken: token.jwt,
			org: org.id,
			page
		});

		return {
			deleteForm,
			portraitTemplates: result.portraitTemplates ?? [],
			portraitTemplatePageCount: result.totalPages,
			portraitTemplatePage: result.pageNumber
		};
	}

	return {
		form,
		portraitTemplateData: isDataRequest
			? loadPortraitTemplateData()
			: await loadPortraitTemplateData()
	};
};

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
	},
	deletePortrait: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(DeletePortraitTemplateRequestSchema));

		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await deletePortraitTemplate({
			accessToken: token.jwt,
			data: form.data
		});
		return {
			deleteForm: form
		};
	}
};
