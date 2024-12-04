import * as v from 'valibot';

const OrgMemberResponseSchema = v.object({
	contactPersonId: v.string(),
	contactPersonName: v.string(),
	membershipType: v.string(),
	email: v.string()
});

export const GetOrgMembersResponseSchema = v.object({
	members: v.array(OrgMemberResponseSchema),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export type GetOrgMembersResponse = typeof GetOrgMembersResponseSchema;
