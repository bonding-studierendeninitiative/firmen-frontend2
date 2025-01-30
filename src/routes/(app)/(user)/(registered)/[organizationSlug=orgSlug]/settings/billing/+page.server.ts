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

export const load: PageServerLoad = async ({ parent, params, fetch }) => {
	const { session, organization } = await parent();
	if (!session?.user) return;
	const response = await getBillingAddressTemplatesForOrganization({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		organizationId: params.organizationSlug,
		fetch
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
};

export const actions: Actions = {
	createBillingAddressTemplate: async ({ locals, request, params, fetch }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateBillingAddressTemplateForm));
		if (!form.valid) {
			return fail(400, { form });
		}
		await createBillingAddressTemplate({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			organizationId: params.organizationSlug,
			data: form.data,
			fetch
		});
		return { form };
	},
	deleteBillingAddressTemplate: async ({ locals, request, params, fetch }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(DeleteBillingAddressTemplateForm));
		if (!form.valid) {
			return fail(400, { form });
		}
		await deleteBillingAddressTemplate({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			organizationId: params.organizationSlug,
			billingAddressTemplateId: form.data.billingAddressTemplateId,
			fetch
		});
		return { form };
	},
	makeBillingAddressTemplateDefault: async ({ locals, request, params, fetch }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}
		const form = await superValidate(request, valibot(MakeBillingAddressTemplateDefaultForm));
		if (!form.valid) {
			return fail(400, { form });
		}
		await makeBillingAddressTemplateDefault({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			organizationId: params.organizationSlug,
			billingAddressTemplateId: form.data.billingAddressTemplateId,
			fetch
		});
		return { form };
	}
};
