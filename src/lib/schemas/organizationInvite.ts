import * as v from 'valibot';

export const CreateOrgInviteRequestSchema = v.object({
	organizationID: v.string(),
	userMail: v.pipe(
		v.string(),
		v.nonEmpty('Please provide an email address'),
		v.email('Invalid email')
	),
	redirectURL: v.string()
});

export type CreateOrgInviteRequest = typeof CreateOrgInviteRequestSchema;

export const AcceptInviteRequestSchema = v.object({
	organizationSlug: v.string(),
	joinCode: v.string()
});

export type AcceptInviteRequest = typeof AcceptInviteRequestSchema;

/*
{
  "organizationSlug": "string",
  "joinCode": "string",
  "externalUserId": "string"
}

  */
