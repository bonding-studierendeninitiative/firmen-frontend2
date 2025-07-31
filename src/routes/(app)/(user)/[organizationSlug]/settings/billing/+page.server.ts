import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import {
	CreateBillingAddressTemplateForm,
	DeleteBillingAddressTemplateForm,
	MakeBillingAddressTemplateDefaultForm
} from '@schema';

import { fail } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router';

export const load = async (event) => {
	const { initialState, organization } = await event.parent();
	if (!initialState.sessionId || !initialState.orgId) return;

	const api = await createCaller(event)

	async function loadPageData() {
		if (!initialState.sessionId) return;

		const response = await api.billingAddressTemplates.getAll({
			organizationId: organization.id
		})

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
		pageData: event.isDataRequest ? loadPageData() : await loadPageData()
	};
};

export const actions = {
	createBillingAddressTemplate: async (event) => {
		const form = await superValidate(event.request, valibot(CreateBillingAddressTemplateForm));
		if (!form.valid) {
			console.log('Billing address template form invalid:', form);
			return fail(400, { form });
		}

		const api = await createCaller(event)
		
		await api.billingAddressTemplates.create({
			...form.data
		});
		
		return { form };
	},
	deleteBillingAddressTemplate: async (event) => {
		const form = await superValidate(event.request, valibot(DeleteBillingAddressTemplateForm));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event)
		
		await api.billingAddressTemplates.delete(form.data.billingAddressTemplateId);
		
		return { form };
	},
	makeBillingAddressTemplateDefault: async (event) => {
		const form = await superValidate(event.request, valibot(MakeBillingAddressTemplateDefaultForm));
		if (!form.valid) {
			return fail(400, { form });
		}
		
		const api = await createCaller(event)

		await api.billingAddressTemplates.makeDefault(form.data.billingAddressTemplateId);

		return { form };
	}
};
