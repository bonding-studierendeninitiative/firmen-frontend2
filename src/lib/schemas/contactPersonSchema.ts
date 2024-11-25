import { object, omit, string, nullish, minLength, maxLength, array, pipe, email } from 'valibot';
import type { Infer } from 'sveltekit-superforms';
import { APIOrgMembership } from '@schema/organizationMembership';

export const ContactPersonDetailsSchema = object({
	contactPersonId: string(),
	email: string(),
	fullName: nullish(string(), ''),
	title: nullish(string(), ''),
	phoneNumber: string(),
	responsibility: nullish(string(), ''),
	organizationMemberships: array(APIOrgMembership)
});

export const ContactPersonRegistrationRequest = object({
	phone: string(),
	fullName: pipe(
		string('Name is required'),
		minLength(3, 'Your name should be at least 2 characters'),
		maxLength(30, 'Max 30 characters')
	),
	email: pipe(string(), minLength(3, 'At least 3 characters'), email('Invalid email')),
	position: string(),
	externalUserId: string()
});

export const ContactPersonRegistrationForm = omit(ContactPersonDetailsSchema, [
	'contactPersonId',
	'organizationMemberships'
]);

export type ContactPersonDetails = Infer<typeof ContactPersonDetailsSchema>;
export type ContactPersonRegistrationForm = Infer<typeof ContactPersonRegistrationForm>;
export type ContactPersonRegistrationRequest = Infer<typeof ContactPersonRegistrationRequest>;
