import type { PageServerLoad } from './$types';
import {
	createPortraitTemplate,
	getPortraitTemplates,
	deletePortraitTemplate,
	getPortraitTemplate,
	updatePortraitDetails
} from '@/services/portraitTemplates';
import { type Actions, fail } from '@sveltejs/kit';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import {
	PortraitTemplateSchema,
	DeletePortraitTemplateRequestSchema,
	UpdatePortraitTemplateRequestSchema
} from '@schema';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export const load: PageServerLoad = async ({ parent, url, isDataRequest }) => {


	const page = Number(url.searchParams.get('page')) || 0;
	const filter = url.searchParams.get('filter') || '';
	const portraitId = url.searchParams.get('edit');

	async function loadPortraitTemplateData() {
		const { initialState, organization } = await parent();
		if (!initialState?.sessionId) return;

		const deleteForm = await superValidate(valibot(DeletePortraitTemplateRequestSchema));

		const org = await organization;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const result = await getPortraitTemplates({
			accessToken: token.jwt,
			org: org.id,
			page,
			filter
		});

		return {
			deleteForm,
			portraits: result,
		};
	}

	async function loadPortraitDetails() {
		if (!portraitId) {
			const createForm = await superValidate(valibot(PortraitTemplateSchema));
			return {
				createForm,
				portrait: {}
			};
		}

		const { initialState } = await parent();
		if (!initialState?.sessionId) return;


		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');
		const result = await getPortraitTemplate({
			accessToken: token.jwt,
			portraitTemplateId: portraitId
		})
		const createForm = await superValidate(result, valibot(UpdatePortraitTemplateRequestSchema));
		return {
			createForm,
			portrait: result
		}
	}

	return {
		portraitTemplateData: isDataRequest
			? loadPortraitTemplateData()
			: await loadPortraitTemplateData(),
		portraitDetails: isDataRequest ? loadPortraitDetails() : await loadPortraitDetails(),
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
	editPortrait: async ({ locals, request, url }) => {
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


		const portraitId = form.data.id
		if (!portraitId) {
			return fail(400, { form });
		}

		await updatePortraitDetails({
			accessToken: token.jwt,
			data: form.data,
			id: portraitId,
		});

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
