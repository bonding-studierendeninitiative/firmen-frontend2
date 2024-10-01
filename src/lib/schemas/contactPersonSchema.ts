import * as v from 'valibot';
import type { Infer } from 'sveltekit-superforms';

export const ContactPersonDetailsSchema = v.object({
	contactPersonId: v.string(),
	email: v.string(),
	fullName: v.nullish(v.string(), ''),
	title: v.nullish(v.string(), ''),
	phoneNumber: v.string(),
	responsibility: v.nullish(v.string(), '')
});

export const ContactPersonRegistrationRequest = v.object({
	phone: v.string(),
	fullName: v.string(),
	email: v.string(),
	position: v.string(),
	externalUserId: v.string()
});

export const ContactPersonRegistrationForm = v.omit(ContactPersonDetailsSchema, [
	'contactPersonId'
]);

export type ContactPersonDetails = Infer<typeof ContactPersonDetailsSchema>;
export type ContactPersonRegistrationForm = Infer<typeof ContactPersonRegistrationForm>;
export type ContactPersonRegistrationRequest = Infer<typeof ContactPersonRegistrationRequest>;
