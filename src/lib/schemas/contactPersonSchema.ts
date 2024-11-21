import * as v from 'valibot';
import type { Infer } from 'sveltekit-superforms';
import { APIOrgMembership } from '@schema/organizationMembership';

export const ContactPersonDetailsSchema = v.object({
	contactPersonId: v.string(),
	email: v.string(),
	fullName: v.nullish(v.string(), ''),
	title: v.nullish(v.string(), ''),
	phoneNumber: v.string(),
	responsibility: v.nullish(v.string(), ''),
	organizationMemberships:  v.array(APIOrgMembership)
});

export const ContactPersonRegistrationRequest = v.object({
	phone: v.string(),
	fullName: v.pipe(
		v.string('Name is required'),
		v.minLength(3, 'Your name should be at least 2 characters'),
		v.maxLength(30, 'Max 30 characters')
	),
	email: v.pipe(v.string(), v.minLength(3, 'At least 3 characters'), v.email('Invalid email')),
	position: v.string(),
	externalUserId: v.string()
});

export const ContactPersonRegistrationForm = v.omit(ContactPersonDetailsSchema, [
	'contactPersonId',
	'organizationMemberships'
]);

export type ContactPersonDetails = Infer<typeof ContactPersonDetailsSchema>;
export type ContactPersonRegistrationForm = Infer<typeof ContactPersonRegistrationForm>;
export type ContactPersonRegistrationRequest = Infer<typeof ContactPersonRegistrationRequest>;
