import type { Infer } from 'sveltekit-superforms';
import * as v from 'valibot';

export const CreateOrganizationRequestSchema = v.object({
	name: v.pipe(
		v.string('Name is required'),
		v.minLength(3, 'Your name should be at least 2 characters'),
		v.maxLength(30, 'Max 30 characters')
	),
	phone: v.pipe(v.string('Type is required.'), v.nonEmpty('Phone number is required')),
	size: v.optional(v.string(), ''),
	email: v.pipe(v.string(), v.minLength(3, 'At least 3 characters'), v.email('Invalid email')),
	streetAddress: v.pipe(
		v.string(),
		v.minLength(3, 'At least 3 characters'),
		v.maxLength(30, 'Max 40 characters')
	),
	extendedAddress: v.optional(v.pipe(v.string(), v.maxLength(150, 'Max 150 characters'))),
	zipCode: v.pipe(
		v.string(),
		v.minLength(3, 'At least 3 characters'),
		v.maxLength(10, 'Max 10 characters')
	),
	locality: v.pipe(
		v.string(),
		v.minLength(3, 'At least 3 characters'),
		v.maxLength(40, 'Max 40 characters')
	),
	type: v.pipe(v.string('Type is required.'), v.nonEmpty('Please select a type.')),
	countryCode: v.optional(v.pipe(v.string(), v.nonEmpty('Country Code is Required')), 'DE')
});
export type CreateOrganizationRequest = Infer<typeof CreateOrganizationRequestSchema>;

export const CreateOrganizationResponse = v.object({
	createdOrganization: v.object({
		id: v.string(),
		slug: v.string(),
		name: v.string(),
		organizationEmail: v.string(),
		organizationPhone: v.string(),
		organizationWebsite: v.nullish(v.string()),
		defaultBillingAddressId: v.nullish(v.string()),
		organizationAddress: v.object({
			street: v.string(),
			country: v.string(),
			zipCode: v.string(),
			city: v.optional(v.string())
		}),
		createdAt: v.pipe(v.string(), v.isoTimestamp()),
		modifiedAt: v.nullable(v.pipe(v.string(), v.isoTimestamp()))
	}),
	creator: v.string()
});

export type CreateOrganizationResponse = Infer<typeof CreateOrganizationResponse>;
