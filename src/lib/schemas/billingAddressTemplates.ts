import * as v from 'valibot';

export const BillingAddressTemplate = v.object({
	id: v.string(),
	organizationID: v.string(),
	street: v.string(),
	country: v.string(),
	zipCode: v.string(),
	city: v.string(),
	vat: v.string(),
	billingReference: v.string(),
	organizationName: v.string()
});

export type BillingAddressTemplate = typeof BillingAddressTemplate;

export const GetBillingAddressTemplateForOrganizationResponse = v.object({
	billingAddressTemplates: v.array(BillingAddressTemplate),
	totalElements: v.number(),
	totalPages: v.number()
});

export type GetBillingAddressTemplateForOrganizationResponse =
	typeof GetBillingAddressTemplateForOrganizationResponse;

export const CreateBillingAddressTemplateForm = v.object({
	street: v.pipe(v.string('Street is required'), v.nonEmpty('Cannot be empty')),
	country: v.pipe(v.string('Street is required'), v.nonEmpty('Cannot be empty')),
	zipCode: v.pipe(v.string('Street is required'), v.nonEmpty('Cannot be empty')),
	city: v.pipe(v.string('Street is required'), v.nonEmpty('Cannot be empty')),
	vat: v.string(),
	billingReference: v.string(),
	organizationName: v.pipe(v.string('Street is required'), v.nonEmpty('Cannot be empty'))
});

export type CreateBillingAddressTemplateForm = typeof CreateBillingAddressTemplateForm;

export const DeleteBillingAddressTemplateForm = v.object({
	billingAddressTemplateId: v.string()
});

export const MakeBillingAddressTemplateDefaultForm = DeleteBillingAddressTemplateForm;

export type DeleteBillingAddressTemplateForm = typeof DeleteBillingAddressTemplateForm;
export type MakeBillingAddressTemplateDefaultForm = typeof DeleteBillingAddressTemplateForm;
