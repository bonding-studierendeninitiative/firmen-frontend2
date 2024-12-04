import type { Infer } from 'sveltekit-superforms';
import * as v from 'valibot';

export const GetOrgDetailsResponse = v.object({
	id: v.string(),
	slug: v.string(),
	name: v.string(),
	organizationEmail: v.pipe(v.string(), v.email()),
	organizationPhone: v.string(),
	organizationWebsite: v.nullish(v.string()),
	defaultBillingAddressId: v.nullish(v.string()),
	organizationAddress: v.object({
		street: v.string(),
		extendedAddress: v.nullable(v.string()),
		country: v.pipe(v.string(), v.length(2, 'Must be 2 characters')),
		zipCode: v.string(),
		locality: v.string()
	}),
	createdAt: v.nullable(v.pipe(v.string(), v.isoTimestamp())),
	modifiedAt: v.pipe(v.string(), v.isoTimestamp()),
	organizationType: v.nullish(v.string())
});

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

export type SetOrgDetailsRequest = Infer<typeof SetOrgDetailsRequestSchema>;
export type GetOrgDetailsResponse = Infer<typeof GetOrgDetailsResponse>;
