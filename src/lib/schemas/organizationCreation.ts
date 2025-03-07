import * as v from 'valibot';

export const CreateOrgRequestSchema = v.object({
	name: v.pipe(v.string(), v.nonEmpty()),
	ownerMail: v.pipe(
		v.string(),
		v.nonEmpty('Please provide an email address'),
		v.email('Invalid email')
	),
});

export type CreateOrgRequest = typeof CreateOrgRequestSchema;