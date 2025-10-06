import { command, query } from '$app/server';
import { object, string, number, optional, boolean, union, literal, nullish, slug } from 'valibot';
import { createAdminContext } from '@/trpc/server';
import { error } from '@sveltejs/kit';

export const getOrgDetails = query(
	object({
		organizationId: string()
	}),
	async ({ organizationId }) => {
		const ctx = await createAdminContext();
		const org = await ctx.db.organization.findUnique({
			where: {
				id: organizationId
			},
			include: {
				members: {
					select: {
						id: true,
						organizationId: true,
						userId: true,
						role: true,
						user: {
							select: {
								id: true,
								name: true,
								email: true
							}
						}
					}
				}
			}
		});
		return org;
	}
);

export type OrganizationResponse = Exclude<ReturnType<typeof getOrgDetails>['current'], undefined>;

export const identifyOrg = query(
	object({
		slug: string()
	}),
	async ({ slug }) => {
		const ctx = await createAdminContext();
		const org = await ctx.db.organization.findUnique({
			where: {
				slug: slug
			}
		});
		return org;
	}
);

export const getOrgMembers = query(
	object({
		organizationId: string(),
		limit: nullish(number(), 10),
		page: nullish(number(), 0),
		orderBy: nullish(union([literal('role'), literal('createdAt')]), 'createdAt'),
		sortDirection: nullish(union([literal('asc'), literal('desc')]), 'asc')
	}),
	async ({ organizationId, limit, page, orderBy, sortDirection }) => {
		const ctx = await createAdminContext();

		const members = await ctx.db.member.findMany({
			where: {
				organizationId: organizationId
			},
			include: {
				user: {
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
						banned: true
					}
				}
			},
			take: limit,
			skip: page * limit,
			orderBy: {
				[orderBy]: sortDirection
			}
		});
		return { members, totalCount: members.length, page, limit };
	}
);

export const updateRole = command(
	object({
		organizationId: string(),
		memberId: string(),
		role: union([literal('member'), literal('admin'), literal('owner')])
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const member = await ctx.db.member.findUnique({
			where: {
				id: input.memberId
			}
		});

		if (!member) {
			error(404, 'Member not found');
		}
		const org = await ctx.db.organization.findUnique({
			where: {
				id: input.organizationId
			}
		});
		if (!org) {
			error(404, 'Organization not found');
		}
		await ctx.db.member.update({
			where: {
				id: input.memberId
			},
			data: {
				role: input.role
			}
		});
	}
);

export const removeMember = command(
	object({
		organizationId: string(),
		userId: string(),
		sendNotification: optional(boolean(), false)
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const user = await ctx.db.user.findUnique({
			where: {
				id: input.userId
			}
		});

		if (!user) {
			error(404, 'User not found');
		}

		const org = await ctx.db.organization.findUnique({
			where: {
				id: input.organizationId
			}
		});

		if (!org) {
			error(404, 'Organization not found');
		}

		const member = await ctx.db.member.findFirst({
			where: {
				AND: {
					userId: input.userId,
					organizationId: input.organizationId
				}
			}
		});

		if (!member) {
			error(404, 'Member not found');
		}

		const removeMembership = await ctx.db.member.delete({
			where: {
				organizationId: input.organizationId,
				id: member.id
			}
		});

		if (!removeMembership) {
			error(500, 'The user could not be removed from the organization');
		}

		if (input.sendNotification && user.email) {
			const remover = await ctx.db.user.findUnique({
				where: {
					id: ctx.session?.userId
				}
			});

			if (!remover) {
				error(404, 'Remover not found');
			}

			const result = await ctx.api.request('post', '/api/v2/notifications/org-member-removal', {
				body: {
					adminId: remover.id,
					organizationId: removeMembership.organizationId,
					recipientEmail: user.email,
					userId: removeMembership.userId,
					locale: 'en'
				}
			});

			if (result.status !== 204) {
				error(500, 'The user could not be notified');
			}
		}
	}
);
export const addMember = command(
	object({
		organizationId: string(),
		userId: string(),
		sendNotification: optional(boolean(), false)
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const user = await ctx.db.user.findUnique({
			where: {
				id: input.userId
			}
		});

		if (!user) {
			error(404, 'User not found');
		}

		const org = await ctx.db.organization.findUnique({
			where: {
				id: input.organizationId
			}
		});

		if (!org) {
			error(404, 'Organization not found');
		}

		const createdOrgMembership = await ctx.auth.addMember({
			body: {
				organizationId: org.id,
				userId: user.id,
				role: 'member'
			}
		});

		if (input.sendNotification && user.email) {
			const inviter = await ctx.db.user.findUnique({
				where: {
					id: ctx.session?.userId
				}
			});

			if (!inviter) {
				error(404, 'Inviter not found');
			}

			const result = await ctx.api.request('post', '/api/v2/notifications/org-member', {
				body: {
					adminId: inviter.id,
					organizationId: createdOrgMembership?.organizationId ?? org.id,
					recipientEmail: user.email,
					userId: createdOrgMembership?.userId ?? user.id,
					locale: 'en'
				}
			});

			if (result.status !== 204) {
				error(500, 'The user could not be notified');
			}
		}

		getOrgMembers({
			organizationId: org.id
		}).refresh();
	}
);

export const getSsoProviders = query(
	object({
		organizationId: string()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const providers = await ctx.db.ssoProvider.findMany({
			where: {
				organizationId: input.organizationId
			},
			select: {
				id: true,
				oidcConfig: true,
				samlConfig: true,
				providerId: true,
				user: {
					select: {
						id: true,
						name: true,
						email: true
					}
				},
				domain: true,
				issuer: true,
				organizationId: true
			}
		});
		return providers;
	}
);
