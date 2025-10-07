import { query, form, command } from '$app/server';
import { object, nullish, string, pipe, minLength } from 'valibot';
import { error } from '@sveltejs/kit';
import { createOrgMemberContext } from '@/remote/context';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import {
	CreateBillingAddressTemplateForm as CreateBillingFormSchema,
	DeleteBillingAddressTemplateForm as DeleteBillingFormSchema,
	MakeBillingAddressTemplateDefaultForm as MakeDefaultBillingFormSchema
} from '@schema';
import { orgMemberQuery } from '../auth-guards';

export const getBillingAddressTemplates = orgMemberQuery(
	object({
		page: nullish(string(), '0'),
		limit: nullish(string(), '10')
	}),
	async ({ input, ctx }) => {
		const response = await ctx.api.request(
			'get',
			'/api/v2/organization/{organizationId}/billing-address-template',
			{
				path: { organizationId: ctx.session.activeOrganizationId },
				query: {
					page: Number(input.page),
					size: Number(input.limit),
					sortDirection: 'desc',
					sortBy: 'creationDate'
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
		organizationId: pipe(
			string('Organization ID is required'),
			minLength(1, 'Organization ID is required')
		),
		street: pipe(
			string('Die Straße ist erforderlich.'),
			minLength(2, 'Die Straße muss mindestens 2 Zeichen lang sein.')
		),
		city: pipe(
			string('Die Stadt ist erforderlich.'),
			minLength(2, 'Die Stadt muss mindestens 2 Zeichen lang sein.')
		),
		zipCode: pipe(
			string('Die Postleitzahl ist erforderlich.'),
			minLength(4, 'Die Postleitzahl muss mindestens 4 Zeichen lang sein.')
		),
		country: pipe(
			string('Das Land ist erforderlich.'),
			minLength(2, 'Das Land muss mindestens 2 Zeichen lang sein.')
		),
		vat: pipe(string()),
		organizationName: pipe(
			string('Der Organisationsname ist erforderlich.'),
			minLength(2, 'Der Organisationsname muss mindestens 2 Zeichen lang sein.')
		),
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
