import { command } from '$app/server';
import { literal, object, optional, string, union } from 'valibot';
import { makeSerializable } from '@/utils/serializable';
import { error } from '@sveltejs/kit';
import { createAuthenticatedContext } from '@/remote/context';
import { orgMemberQuery } from '../auth-guards';

export const generateInvite = command(
	object({
		email: string(),
		organizationID: string(),
		role: union([literal('admin'), literal('member')])
	}),
	async (input) => {
		const ctx = await createAuthenticatedContext();
		try {
			const orgInvite = await ctx.auth.createInvitation({
				body: {
					organizationId: input.organizationID,
					email: input.email,
					resend: true,
					role: input.role as 'admin' | 'member'
				}
			});
			return makeSerializable(orgInvite);
		} catch (e) {
			error(500, e instanceof Error ? e.message : 'Failed to generate organization invite');
		}
	}
);

export const getOrgMembers = orgMemberQuery(
	object({
		limit: string(),
		offset: string(),
		orderBy: optional(string(), 'first_name'),
		orderDirection: optional(string(), 'asc')
	}),
	async ({ input, ctx }) => {
		try {
			return await ctx.auth.listMembers({
				query: {
					organizationId: ctx.session.activeOrganizationId,
					limit: Number(input.limit) || 10,
					offset: Number(input.offset) || 0,
					sortBy: input.orderBy || undefined,
					sortDirection: (input.orderDirection as 'asc' | 'desc') || 'asc'
				}
			});
		} catch (e) {
			error(500, e instanceof Error ? e.message : 'Failed to get organization members');
		}
	}
);

export type GetOrgMembersResponse = Awaited<ReturnType<typeof getOrgMembers>>;

export const getAll = orgMemberQuery(
	object({
		limit: string(),
		offset: string(),
		sortBy: optional(string(), 'createdAt'),
		sortDirection: optional(union([literal('asc'), literal('desc')]), 'desc')
	}),
	async ({ input, ctx }) => {
		try {
			return await ctx.auth.listMembers({
				query: {
					limit: Number(input.limit) || 10,
					offset: Number(input.offset) || 0,
					organizationId: ctx.session.activeOrganizationId,
					sortBy: input.sortBy,
					sortDirection: (input.sortDirection as 'asc' | 'desc') || 'desc'
				},
				headers: { Authorization: `Bearer ${ctx.session?.token}` }
			});
		} catch (e) {
			console.error(e instanceof Error ? e.message : 'Unknown error');
			return { data: [], totalCount: 0 };
		}
	}
);

export const updateRole = command(
	object({
		organizationId: string(),
		memberId: string(),
		role: union([literal('admin'), literal('member'), literal('owner')])
	}),
	async (input) => {
		const ctx = await createAuthenticatedContext();
		try {
			await ctx.auth.updateMemberRole({
				body: { organizationId: input.organizationId, memberId: input.memberId, role: input.role }
			});
		} catch (e) {
			error(500, e instanceof Error ? e.message : 'Failed to update organization member role');
		}
	}
);
