import { authorizedOrgMemberProcedure, authorizedProcedure, router } from '@/trpc/server';
import { object, parse, string, number, union, literal, optional } from 'valibot';
import { TRPCError } from '@trpc/server';
import { makeSerializable } from '@/utils/serializable';
import { SetOrgDetailsRequestSchema } from '@schema';

export const organizationsRouter = router({
	generateInvite: authorizedProcedure
		.input((input) =>
			parse(
				object({
					email: string(),
					organizationID: string(),
					role: union([literal('admin'), literal('member')])
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
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
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to generate organization invite'
				});
			}
		}),

	create: authorizedProcedure
		.input((input) =>
			parse(
				object({
					name: string()
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			try {
				const organization = await ctx.auth.createOrganization({
					body: {
						name: input.name,
						slug: input.name.toLowerCase().replace(/\s+/g, '-'),
						userId: ctx.session.userId,
						metadata: {
							public: {
								name: input.name,
								slug: input.name.toLowerCase().replace(/\s+/g, '-')
							}
						},
						keepCurrentActiveOrganization: false
					}
				});
				return makeSerializable(organization);
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to create organization'
				});
			}
		}),

	getMembers: authorizedProcedure
		.input((input) =>
			parse(
				object({
					id: string(),
					limit: number(),
					offset: number(),
					query: string(),
					orderBy: optional(string(), 'first_name'),
					orderDirection: optional(union([literal('asc'), literal('desc')]), 'asc')
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
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
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to get organization members'
				});
			}
		}),

	getUserMemberships: authorizedProcedure.query(async ({ ctx }) => {
		try {
			const memberships = await ctx.auth.listOrganizations({
				headers: {
					Authorization: `Bearer ${ctx.session.token}`
				}
			});
			return makeSerializable(memberships);
		} catch (e) {
			throw new TRPCError({
				code: 'INTERNAL_SERVER_ERROR',
				message: e instanceof Error ? e.message : 'Failed to get user memberships'
			});
		}
	}),

	getDetails: authorizedProcedure
		.input((input) =>
			parse(
				object({
					slug: string()
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			try {
				const org = await ctx.db.organization.findFirst({
					where: { slug: input.slug },
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
				return makeSerializable(org);
			} catch (e) {
				if (typeof e === 'object' && e !== null && 'status' in e && (e as any).status === 404) {
					return null;
				}
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to get organization details'
				});
			}
		}),

	getDetailsById: authorizedProcedure
		.input((input) =>
			parse(
				object({
					id: string()
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			try {
				const org = await ctx.auth.getFullOrganization({
					query: {
						organizationId: input.id
					},
					headers: {
						Authorization: `Bearer ${ctx.session.token}`
					}
				});
				return makeSerializable(org);
			} catch (e) {
				if (typeof e === 'object' && e !== null && 'status' in e && (e as any).status === 404) {
					return null;
				}
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to get organization details'
				});
			}
		}),

	setDetails: authorizedOrgMemberProcedure
		.input((input) => parse(SetOrgDetailsRequestSchema, input))
		.mutation(async ({ ctx, input }) => {
			try {
				const metadataQuery = await ctx.db.organization.findUnique({
					where: { id: ctx.session.activeOrganizationId },
					select: {
						id: true,
						metadata: true
					}
				});

				if (!metadataQuery) {
					throw new TRPCError({
						code: 'NOT_FOUND',
						message: 'Organization not found'
					});
				}

				const metadata = JSON.parse(metadataQuery.metadata ?? '{"public": {}}').public || {};

				await ctx.auth.updateOrganization({
					body: {
						organizationId: ctx.session.activeOrganizationId,
						data: {
							metadata: {
								public: {
									...metadata,
									...input
								}
							}
						}
					},
					headers: {
						Authorization: `Bearer ${ctx.session.token}`
					}
				});
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to set organization details'
				});
			}
		})
});
