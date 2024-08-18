import * as v from 'valibot';
import type { Infer } from 'sveltekit-superforms';


export const ContactPersonDetailsSchema = v.object({
	contactPersonId: v.string(),
	email: v.string(),
	firstName: v.nullish(v.string()),
	lastName: v.nullish(v.string()),
	title: v.nullish(v.string()),
	phoneNumber: v.string(),
	responsibility: v.nullish(v.string()),
})

export type ContactPersonDetails = Infer<typeof ContactPersonDetailsSchema>;