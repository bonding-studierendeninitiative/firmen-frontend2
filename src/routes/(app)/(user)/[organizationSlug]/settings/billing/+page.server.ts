import {
	createBillingAddressTemplate,
	deleteBillingAddressTemplate,
	getBillingAddressTemplatesForOrganization,
	makeBillingAddressTemplateDefault
} from '@/services';
import type { Actions, PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import {
	CreateBillingAddressTemplateForm,
	DeleteBillingAddressTemplateForm,
	MakeBillingAddressTemplateDefaultForm
} from '@schema';

import { fail } from '@sveltejs/kit';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export const load: PageServerLoad = async ({ parent, isDataRequest }) => {
	const { initialState, organization } = await parent();
	if (!initialState.sessionId || !initialState.orgId) return;

	async function loadPageData() {
		if (!initialState.sessionId) return;
		const org = await organization;
		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');
		const response = await getBillingAddressTemplatesForOrganization({
			accessToken: token.jwt,
			organizationId: org.id
		});

		const createBillingAddressTemplateForm = await superValidate(
			valibot(CreateBillingAddressTemplateForm)
		);

		const deleteBillingAddressTemplateForm = await superValidate(
			valibot(DeleteBillingAddressTemplateForm)
		);

		const makeBillingAddressTemplateDefaultForm = await superValidate(
			valibot(MakeBillingAddressTemplateDefaultForm)
		);

		return {
			billingAddressTemplates: response.billingAddressTemplates,
			createBillingAddressTemplateForm,
			deleteBillingAddressTemplateForm,
			makeBillingAddressTemplateDefaultForm,
			organization
		};
	}

	return {
		pageData: isDataRequest ? loadPageData() : await loadPageData()
	};
};

export const actions: Actions = {
	createBillingAddressTemplate: async ({ locals, request, fetch }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId || !session.orgId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateBillingAddressTemplateForm));
		if (!form.valid) {
			console.log('Billing address template form invalid:', form);
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');
		await createBillingAddressTemplate({
			accessToken: token.jwt,
			organizationId: session.orgId,
			data: form.data,
			fetch
		});
		return { form };
	},
	deleteBillingAddressTemplate: async ({ locals, request, fetch }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId || !session.orgId) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(DeleteBillingAddressTemplateForm));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');
		await deleteBillingAddressTemplate({
			accessToken: token.jwt,
			organizationId: session.orgId,
			billingAddressTemplateId: form.data.billingAddressTemplateId,
			fetch
		});
		return { form };
	},
	makeBillingAddressTemplateDefault: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.orgId) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(MakeBillingAddressTemplateDefaultForm));
		if (!form.valid) {
			return fail(400, { form });
		}

		await makeBillingAddressTemplateDefault({
			organizationId: session.orgId,
			billingAddressTemplateId: form.data.billingAddressTemplateId
		});

		return { form };
	}
};
