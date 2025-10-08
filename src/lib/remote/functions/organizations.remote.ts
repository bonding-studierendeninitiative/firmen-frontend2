import { command, form, query } from '$app/server';
import { object, string, union, literal } from 'valibot';
import { error } from '@sveltejs/kit';
import { SetOrgAddressSchema, SetOrgDetailsRequestSchema } from '@schema';
import { createAuthenticatedContext, createOrgMemberContext } from '@/remote/context';

export const createInvite = form(
	object({
		email: string(),
		organizationID: string(),
		role: union([literal('admin'), literal('member')])
	}),
	async (input) => {
		try {
			const ctx = await createOrgMemberContext();
			return await ctx.auth.createInvitation({
				body: {
					organizationId: input.organizationID,
					email: input.email,
					resend: true,
					role: input.role as 'admin' | 'member'
				}
			});
		} catch (e) {
			error(500, e instanceof Error ? e.message : 'Failed to generate organization invite');
		}
	}
);

export const createOrganizationByUserForm = form(object({ name: string() }), async (input) => {
	const ctx = await createAuthenticatedContext();
	if (!ctx.session) error(401, 'Unauthorized');
	try {
		return await ctx.auth.createOrganization({
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
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to create organization');
	}
});

export const getUserMemberships = query(object({}), async () => {
	const ctx = await createAuthenticatedContext();
	if (!ctx.session) error(401, 'Unauthorized');
	try {
		const memberships = await ctx.db.organization.findMany({
			where: {
				members: {
					some: {
						userId: ctx.session.userId
					}
				}
			},
			include: {
				members: {
					select: {
						id: true,
						organizationId: true,
						userId: true,
						role: true
					}
				}
			}
		});
		return memberships;
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to get user memberships');
	}
});

export const getDetails = query(object({ slug: string() }), async (input) => {
	const ctx = await createAuthenticatedContext();
	try {
		return await ctx.db.organization.findFirst({
			where: { slug: input.slug },
			include: { members: { select: { id: true, organizationId: true, userId: true, role: true } } }
		});
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to get organization details');
	}
});

export const getDetailsById = query(object({ id: string() }), async (input) => {
	const ctx = await createAuthenticatedContext();
	try {
		return await ctx.db.organization.findFirst({
			where: { id: input.id },
			include: { members: { select: { id: true, organizationId: true, userId: true, role: true } } }
		});
	} catch (e) {
		error(500, e instanceof Error ? e.message : 'Failed to get organization details');
	}
});

export const setDetails = command(
	object({ orgId: string(), data: SetOrgDetailsRequestSchema }),
	async ({ orgId, data }) => {
		const ctx = await createAuthenticatedContext();
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

export const editOrganizationDetails = form(SetOrgDetailsRequestSchema, async (input) => {
	const ctx = await createOrgMemberContext();
	try {
		const org = await ctx.db.organization.findUnique({
			where: { id: ctx.session.activeOrganizationId }
		});
		if (!org) {
			error(404, 'Organization not found');
		}
		const oldMetadata = JSON.parse(org.metadata || '{"public": {}}');
		const updatedOrg = await ctx.auth.updateOrganization({
			body: {
				organizationId: ctx.session.activeOrganizationId,
				data: { metadata: { public: { ...oldMetadata.public, ...input } } }
			},
			headers: { Authorization: `Bearer ${ctx.session?.token}` }
		});
		return updatedOrg;
	} catch (e) {
		console.error('Error updating organization details:', e);
		error(500, e instanceof Error ? e.message : 'Error updating organization details');
	}
});

export const editOrganizationAddress = form(SetOrgAddressSchema, async (input) => {
	const ctx = await createOrgMemberContext();
	try {
		const org = await ctx.db.organization.findUnique({
			where: { id: ctx.session.activeOrganizationId }
		});
		if (!org) {
			error(404, 'Organization not found');
		}
		const oldMetadata = JSON.parse(org.metadata || '{"public": {}}');
		const updatedOrg = await ctx.auth.updateOrganization({
			body: {
				organizationId: ctx.session.activeOrganizationId,
				data: { metadata: { public: { ...oldMetadata.public, organizationAddress: input } } }
			},
			headers: { Authorization: `Bearer ${ctx.session?.token}` }
		});
		return updatedOrg?.metadata?.public?.organizationAddress;
	} catch (e) {
		console.error('Error updating organization address:', e);
		error(500, e instanceof Error ? e.message : 'Error updating organization address');
	}
});
