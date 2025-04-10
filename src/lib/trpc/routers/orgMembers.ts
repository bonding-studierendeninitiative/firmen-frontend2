import { publicProcedure, router } from '@/trpc/server';
import { TRPCError } from '@trpc/server';
import { clerkClient } from 'svelte-clerk/server';

export const orgMembersRouter = router({
	get: publicProcedure.query(async ({ ctx }) => {
		if (ctx.session.orgId == null)
			throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
		const organizationMembers = await clerkClient.organizations.getOrganizationMembershipList({
			organizationId: ctx.session.orgId
		});
		return organizationMembers.data;
	})
});
