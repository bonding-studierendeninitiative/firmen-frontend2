import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { literal, object, optional, parse, record, string, union, unknown } from 'valibot';
import { TRPCError } from '@trpc/server';
import { makeSerializable } from '@/utils/serializable';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema } from '@schema';
import { PUBLIC_APP_URL } from '$env/static/public';
import { auth } from '@/auth';

export const orgMembersRouter = router({
	createInviteForm: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					organizationId: string()
				}),
				input
			)
		)
		.query(async ({ input }) => {
			return await superValidate(
				{
					organizationID: input.organizationId,
					redirectURL: PUBLIC_APP_URL
				},
				valibot(CreateOrgInviteRequestSchema),
				{ errors: false }
			);
		}),
	generateInvite: authorizedOrgMemberProcedure
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
	create: authorizedOrgMemberProcedure
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
	getMembers: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					limit: string(),
					offset: string(),
					orderBy: optional(string(), 'first_name'),
					orderDirection: optional(string(), 'asc')
				}),
				input
			)
		)
		.query(async ({ input, ctx }) => {
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
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to get organization members'
				});
			}
		}),
	getUserMemberships: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					userId: string()
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			try {
				const memberships = await ctx.db.member.findMany({
					where: {
						userId: input.userId
					},
					take: 10,
					skip: 0
				});
				return makeSerializable(memberships);
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to get user memberships'
				});
			}
		}),
	getDetails: authorizedOrgMemberProcedure
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
				const org = await ctx.auth.getFullOrganization({
					query: {
						organizationSlug: input.slug
					},
					headers: {
						Authorization: `Bearer ${ctx.session.token}`
					}
				});
				return makeSerializable(org);
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to get organization details'
				});
			}
		}),
	setDetails: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					orgId: string(),
					data: record(string(), unknown())
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.auth.updateOrganization({
					body: {
						organizationId: input.orgId,
						data: {
							metadata: {
								public: {
									...input.data
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
		}),
	getAll: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					limit: string(),
					offset: string(),
					sortBy: optional(string(), 'createdAt'),
					sortDirection: optional(union([literal('asc'), literal('desc')]), 'desc')
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			try {
				const members = await ctx.auth.listMembers({
					query: {
						limit: Number(input.limit) || 10,
						offset: Number(input.offset) || 0,
						organizationId: ctx.session.activeOrganizationId,
						sortBy: input.sortBy,
						sortDirection: (input.sortDirection as 'asc' | 'desc') || 'desc'
					},
					headers: {
						Authorization: `Bearer ${ctx.session.token}`
					}
				});
				return makeSerializable(members);
			} catch (e) {
				console.error(e instanceof Error ? e.message : 'Unknown error');
				return {
					data: [],
					totalCount: 0
				};
			}
		}),
	updateRole: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					organizationId: string(),
					memberId: string(),
					role: union([literal('admin'), literal('member'), literal('owner')])
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			try {
				await ctx.auth.updateMemberRole({
					body: {
						organizationId: input.organizationId,
						memberId: input.memberId,
						role: input.role
					}
				});
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to update organization member role'
				});
			}
		})
});
