import type { Infer } from 'sveltekit-superforms';
import * as v from 'valibot';

export const APIOrgMembership = v.object({
	organizationId: v.string(),
	organizationName: v.string(),
	membershipType: v.string(),
	organizationSlug: v.string()
});

export type OrgMembership = Infer<typeof APIOrgMembership>;

export const GetOrgMembershipsResponseSchema = v.object({
	memberships: v.array(APIOrgMembership),
	totalElements: v.number(),
	totalPages: v.number(),
	pageNumber: v.number(),
	pageSize: v.number()
});

export type GetOrgMembershipsResponse = Infer<typeof GetOrgMembershipsResponseSchema>;
