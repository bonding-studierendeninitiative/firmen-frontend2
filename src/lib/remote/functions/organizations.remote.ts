import { command, form, query } from '$app/server';
import { object, string, number, union, literal, optional } from 'valibot';
import { error } from '@sveltejs/kit';
import { makeSerializable } from '@/utils/serializable';
import { SetOrgDetailsRequestSchema } from '@schema';
import { createAuthorizedContext, createOrgMemberContext } from '@/remote/context';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';

export const generateInvite = command(
	object({
		email: string(),
		organizationID: string(),
		role: union([literal('admin'), literal('member')])
	}),
	async (input) => {
		const ctx = await createAuthorizedContext();
		if (!ctx.session) error(401, 'Unauthorized');
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

export const createInvite = form(
	object({
		email: string(),
		organizationID: string(),
		role: union([literal('admin'), literal('member')])
	}),
	async (input) => {
		try {
			const ctx = await createOrgMemberContext();
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
	if (!ctx.session) error(401, 'Unauthorized');
	try {
		const organization = await ctx.auth.createOrganization({
			body: {
				name: input.name,
				slug: input.name.toLowerCase().replace(/\s+/g, '-'),
				userId: ctx.session.userId,
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

export const getMembers = query(
	object({
		id: string(),
		limit: number(),
		offset: number(),
		query: string(),
		orderBy: optional(string(), 'first_name'),
		orderDirection: optional(union([literal('asc'), literal('desc')]), 'asc')
	}),
	async (input) => {
		const ctx = await createAuthorizedContext();
		try {
			const orgMemberships = await ctx.auth.listMembers({
				query: {
					organizationId: input.id,
					limit: input.limit,
					offset: input.offset,
					sortBy: input.orderBy,
					sortDirection: input.orderDirection
				}
			});
			return makeSerializable(orgMemberships);
		} catch (e) {
			error(500, e instanceof Error ? e.message : 'Failed to get organization members');
		}
	}
);

export const getUserMemberships = query(object({}), async () => {
	const ctx = await createAuthorizedContext();
	if (!ctx.session) error(401, 'Unauthorized');
	try {
		const memberships = await ctx.auth.listOrganizations({
			headers: { Authorization: `Bearer ${ctx.session?.token}` }
		});
		return makeSerializable(memberships);
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to get user memberships');
	}
});

export const getDetails = query(object({ slug: string() }), async (input) => {
	const ctx = await createAuthorizedContext();
	try {
		const org = await ctx.db.organization.findFirst({
			where: { slug: input.slug },
			include: { members: { select: { id: true, organizationId: true, userId: true, role: true } } }
		});
		return makeSerializable(org);
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to get organization details');
	}
});

export const getDetailsById = query(object({ id: string() }), async (input) => {
	const ctx = await createAuthorizedContext();
	try {
		const org = await ctx.db.organization.findFirst({
			where: { id: input.id },
			include: { members: { select: { id: true, organizationId: true, userId: true, role: true } } }
		});
		return org;
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to get organization details');
	}
});

export const setDetails = command(
	object({ orgId: string(), data: SetOrgDetailsRequestSchema }),
	async ({ orgId, data }) => {
		const ctx = await createAuthorizedContext();
		if (!ctx.session) error(401, 'Unauthorized');
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

export const editOrganizationDetailsForm = query(async () => {
	const ctx = await createOrgMemberContext();
	const organization = await ctx.db.organization.findUnique({
		where: { id: ctx.session.activeOrganizationId }
	});
	if (!organization) error(404, 'Organization not found');
	const editOrganizationDetailsForm = await superValidate(
		JSON.parse(organization.metadata || '{"public": {}}').public,
		valibot(SetOrgDetailsRequestSchema),
		{
			errors: false
		}
	);
	return editOrganizationDetailsForm;
});
