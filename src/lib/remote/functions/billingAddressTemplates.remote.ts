import { query, form, command } from '$app/server';
import { object, nullish, string } from 'valibot';
import { error } from '@sveltejs/kit';
import { createOrgMemberContext } from '@/remote/context';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import {
	CreateBillingAddressTemplateForm as CreateBillingFormSchema,
	DeleteBillingAddressTemplateForm as DeleteBillingFormSchema,
	MakeBillingAddressTemplateDefaultForm as MakeDefaultBillingFormSchema
} from '@schema';

export const getBillingAddressTemplates = query(
	object({
		page: nullish(string(), '0'),
		limit: nullish(string(), '10')
	}),
	async (input) => {
		const ctx = await createOrgMemberContext();

		const response = await ctx.api.request(
			'get',
			'/api/v2/organization/{organizationId}/billing-address-template',
			{
				path: { organizationId: ctx.session.activeOrganizationId },
				query: {
					page: Number(input.page),
					size: Number(input.limit),
					sortDirection: 'desc',
					sortBy: 'createdAt'
				}
			}
		);

		if (response.status !== 200) {
			error(500, `Could not get billing address templates: ${response.statusText}`);
		}

		return await response.json();
	}
);

export const createBillingAddressTemplate = form(
	object({
		organizationId: string(),
		street: string(),
		city: string(),
		zipCode: string(),
		country: string(),
		vat: string(),
		organizationName: string(),
		billingReference: string()
	}),
	async (data) => {
		const ctx = await createOrgMemberContext();

		const response = await ctx.api.request(
			'post',
			'/api/v2/organization/{organizationId}/billing-address-template',
			{
				path: { organizationId: data.organizationId },
				body: data
			}
		);

		if (response.status !== 200) {
			error(500, 'The billing address template could not be created');
		}

		return await response.json();
	}
);

// Provide superforms for client-side usage (admin-style pattern)
export const createBillingAddressTemplateForm = query(object({}), async () => {
	const createForm = await superValidate({}, valibot(CreateBillingFormSchema), { errors: false });
	return createForm;
});

export const deleteBillingAddressTemplateForm = query(object({}), async () => {
	const deleteForm = await superValidate({}, valibot(DeleteBillingFormSchema), { errors: false });
	return deleteForm;
});

export const makeBillingAddressTemplateDefaultForm = query(object({}), async () => {
	const makeDefaultForm = await superValidate({}, valibot(MakeDefaultBillingFormSchema), {
		errors: false
	});
	return makeDefaultForm;
});

// Delete billing address template via form remote
export const deleteBillingAddressTemplate = command(
	object({ billingAddressTemplateId: string() }),
	async ({ billingAddressTemplateId }) => {
		const ctx = await createOrgMemberContext();

		const response = await ctx.api.request(
			'delete',
			'/api/v2/organization/{organizationId}/billing-address-template/{billingAddressTemplateId}',
			{
				path: { organizationId: ctx.session.activeOrganizationId, billingAddressTemplateId }
			}
		);
		if (response.status !== 204) {
			error(500, 'The billing address template could not be deleted');
		}
		return { success: true } as const;
	}
);

// Make billing address template default via form remote
export const makeBillingAddressTemplateDefault = command(
	object({ billingAddressTemplateId: string() }),
	async ({ billingAddressTemplateId }) => {
		const ctx = await createOrgMemberContext();

		await ctx.auth.updateOrganization({
			body: {
				organizationId: ctx.session.activeOrganizationId,
				data: {
					metadata: {
						public: {
							defaultBillingAddressTemplateId: billingAddressTemplateId
						}
					}
				}
			},
			headers: {
				Authorization: `Bearer ${ctx.session.token}`
			}
		});

		return { success: true } as const;
	}
);
