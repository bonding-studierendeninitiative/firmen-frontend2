import * as v from 'valibot';

export const SetOrgDetailsRequestSchema = v.object({
	name: v.string(),
	organizationEmail: v.pipe(v.string(), v.email()),
	organizationPhone: v.string(),
	organizationWebsite: v.nullish(v.string()),
	defaultBillingAddressId: v.nullish(v.string()),
	organizationAddress: v.object({
		street: v.string(),
		extendedAddress: v.nullish(v.string()),
		country: v.pipe(v.string(), v.length(2, 'Must be 2 characters')),
		zipCode: v.string(),
		locality: v.string()
	})
});

export type SetOrgDetailsRequest = typeof SetOrgDetailsRequestSchema;
