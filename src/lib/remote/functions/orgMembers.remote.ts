import { query, command } from '$app/server';
import { literal, object, optional, record, string, union, unknown } from 'valibot';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema } from '@schema';
import { PUBLIC_APP_URL } from '$env/static/public';
import { makeSerializable } from '@/utils/serializable';
import { error } from '@sveltejs/kit';
import { createAuthorizedContext, createOrgMemberContext } from '@/remote/context';

export const createInviteForm = query(
	object({ organizationId: string() }),
	async ({ organizationId }) => {
		return await superValidate(
			{ organizationID: organizationId, redirectURL: PUBLIC_APP_URL },
			valibot(CreateOrgInviteRequestSchema),
			{ errors: false }
		);
	}
);

export const generateInvite = command(
	object({
		email: string(),
		organizationID: string(),
		role: union([literal('admin'), literal('member')])
	}),
	async (input) => {
		const ctx = await createAuthorizedContext();
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

export const createOrganization = command(object({ name: string() }), async (input) => {
	const ctx = await createAuthorizedContext();
	try {
		const organization = await ctx.auth.createOrganization({
			body: {
				name: input.name,
				slug: input.name.toLowerCase().replace(/\s+/g, '-'),
				userId: ctx.session?.userId,
				metadata: {
					public: { name: input.name, slug: input.name.toLowerCase().replace(/\s+/g, '-') }
				},
				keepCurrentActiveOrganization: false
			}
		});
		return makeSerializable(organization);
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to create organization');
	}
});

export const getOrgMembers = query(
	object({
		limit: string(),
		offset: string(),
		orderBy: optional(string(), 'first_name'),
		orderDirection: optional(string(), 'asc')
	}),
	async (input) => {
		const ctx = await createOrgMemberContext();
		try {
			const orgMemberships = await ctx.auth.listMembers({
				query: {
					organizationId: ctx.session.activeOrganizationId,
					limit: Number(input.limit) || 10,
					offset: Number(input.offset) || 0,
					sortBy: input.orderBy || undefined,
					sortDirection: (input.orderDirection as 'asc' | 'desc') || 'asc'
				}
			});
			return makeSerializable(orgMemberships);
		} catch (e) {
			error(500, e instanceof Error ? e.message : 'Failed to get organization members');
		}
	}
);

export type GetOrgMembersResponse = Awaited<ReturnType<typeof getOrgMembers>>;

export const getUserMemberships = query(object({ userId: string() }), async (input) => {
	const ctx = await createAuthorizedContext();
	try {
		const memberships = await ctx.db.member.findMany({
			where: { userId: input.userId },
			take: 10,
			skip: 0
		});
		return makeSerializable(memberships);
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to get user memberships');
	}
});

export const getDetails = query(object({ slug: string() }), async (input) => {
	const ctx = await createAuthorizedContext();
	try {
		const org = await ctx.auth.getFullOrganization({
			query: { organizationSlug: input.slug },
			headers: { Authorization: `Bearer ${ctx.session?.token}` }
		});
		return makeSerializable(org);
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to get organization details');
	}
});

export const setDetails = command(
	object({ orgId: string(), data: record(string(), unknown()) }),
	async ({ orgId, data }) => {
		const ctx = await createAuthorizedContext();
		try {
			await ctx.auth.updateOrganization({
				body: { organizationId: orgId, data: { metadata: { public: { ...data } } } },
				headers: { Authorization: `Bearer ${ctx.session?.token}` }
			});
		} catch (e) {
			error(500, e instanceof Error ? e.message : 'Failed to set organization details');
		}
	}
);

export const getAll = query(
	object({
		limit: string(),
		offset: string(),
		sortBy: optional(string(), 'createdAt'),
		sortDirection: optional(union([literal('asc'), literal('desc')]), 'desc')
	}),
	async (input) => {
		const ctx = await createOrgMemberContext();
		try {
			const members = await ctx.auth.listMembers({
				query: {
					limit: Number(input.limit) || 10,
					offset: Number(input.offset) || 0,
					organizationId: ctx.session.activeOrganizationId,
					sortBy: input.sortBy,
					sortDirection: (input.sortDirection as 'asc' | 'desc') || 'desc'
				},
				headers: { Authorization: `Bearer ${ctx.session?.token}` }
			});
			return makeSerializable(members);
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
		const ctx = await createAuthorizedContext();
		try {
			await ctx.auth.updateMemberRole({
				body: { organizationId: input.organizationId, memberId: input.memberId, role: input.role }
			});
		} catch (e) {
			error(500, e instanceof Error ? e.message : 'Failed to update organization member role');
		}
	}
);
