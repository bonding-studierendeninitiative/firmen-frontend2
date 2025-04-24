import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { clerkClient } from 'svelte-clerk/server';

export const orgMembersRouter = router({
	get: authorizedOrgMemberProcedure.query(async ({ ctx }) => {
		const organizationMembers = await clerkClient.organizations.getOrganizationMembershipList({
			organizationId: ctx.session.orgId
		});
		return organizationMembers.data;
	})
});
