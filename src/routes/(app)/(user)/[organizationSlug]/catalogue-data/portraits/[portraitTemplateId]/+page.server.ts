import type { PageServerLoad } from './$types';
import { getPortraitTemplate, updatePortraitDetails } from '@/services/portraitTemplates';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { type Actions, fail } from '@sveltejs/kit';
import { PortraitCompanyDetailsSchema, PortraitContactInfoSchema } from '@schema';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export const load: PageServerLoad = async ({ params, parent, isDataRequest }) => {
	const { initialState } = await parent();
	if (!initialState.sessionId) return;

	async function loadPortraitTemplate() {
		if (!initialState.sessionId) return;
		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		return await getPortraitTemplate({
			accessToken: token.jwt,
			portraitTemplateId: params.portraitTemplateId
		});
	}

	const updatePortraitCompanyDetailsForm = superValidate(
		await loadPortraitTemplate(),
		valibot(PortraitCompanyDetailsSchema)
	);
	const updatePortraitContactInfoForm = superValidate(
		await loadPortraitTemplate(),
		valibot(PortraitContactInfoSchema)
	);

	return {
		portraitTemplate: isDataRequest ? loadPortraitTemplate() : await loadPortraitTemplate(),
		updatePortraitCompanyDetailsForm: isDataRequest
			? updatePortraitCompanyDetailsForm
			: await updatePortraitCompanyDetailsForm,
		updatePortraitContactInfoForm: isDataRequest
			? updatePortraitContactInfoForm
			: await updatePortraitContactInfoForm
	};
};

export const actions = {
	updatePortraitCompanyDetails: async ({ request, locals, params }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}
		const updatePortraitCompanyDetailsForm = await superValidate(
			request,
			valibot(PortraitCompanyDetailsSchema)
		);
		if (!updatePortraitCompanyDetailsForm.valid) {
			return fail(400, { updatePortraitCompanyDetailsForm });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');
		await updatePortraitDetails({
			accessToken: token.jwt,
			id: params.portraitTemplateId as string,
			data: updatePortraitCompanyDetailsForm.data
		});
		return {
			updatePortraitCompanyDetailsForm
		};
	},
	updatePortraitContactInfo: async ({ request, locals, params }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}
		const updatePortraitContactInfoForm = await superValidate(
			request,
			valibot(PortraitContactInfoSchema)
		);
		if (!updatePortraitContactInfoForm.valid) {
			return fail(400, { updatePortraitContactInfoForm });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');
		await updatePortraitDetails({
			accessToken: token.jwt,
			id: params.portraitTemplateId as string,
			data: updatePortraitContactInfoForm.data
		});
		return {
			updatePortraitContactInfoForm
		};
	}
} satisfies Actions;
