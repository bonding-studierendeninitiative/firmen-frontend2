import type { Infer } from 'sveltekit-superforms';
import * as v from 'valibot';

export const CreateOrgInviteRequestSchema = v.object({
	organizationSlug: v.string(),
	userMail: v.pipe(
		v.string(),
		v.nonEmpty('Please provide an email address'),
		v.email('Invalid email')
	),
	redirectURL: v.string()
});

export type CreateOrgInviteRequest = Infer<typeof CreateOrgInviteRequestSchema>;

export const AcceptInviteRequestSchema = v.object({
	organizationSlug: v.string(),
	joinCode: v.string()
});

export type AcceptInviteRequest = Infer<typeof AcceptInviteRequestSchema>;

/*
{
  "organizationSlug": "string",
  "joinCode": "string",
  "externalUserId": "string"
}

  */