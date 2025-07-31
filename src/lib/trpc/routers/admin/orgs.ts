import { adminProcedure, router } from '@/trpc/server';
import { boolean, literal, nullish, number, object, optional, parse, string, union } from 'valibot';
import { clerkClient } from 'svelte-clerk/server';
import { CreateOrgInviteRequestSchema, CreateOrgRequestSchema } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { makeSerializable } from '@/utils';
import { PUBLIC_APP_URL } from '$env/static/public';
import { TRPCError } from '@trpc/server';

const keys = [
	'phone_number',
	'email_address',
	'created_at',
	'first_name',
	'last_name',
	'username',
] as const;

const OrderBySchema = union(
	keys.flatMap((key) => [
		// without sign
		literal(key),
		// with plus
		literal((`+${key}`) as `+${typeof key}`),
		// with minus
		literal((`-${key}`) as `-${typeof key}`),
	]),
);

export const adminOrgsRouter = router({
	members: router({
		getAll: adminProcedure
			.input((input) =>
				parse(
					object({
						organizationId: string(),
						limit: nullish(number(), 10),
						page: nullish(number(), 0),
						sort: nullish(OrderBySchema, "+first_name")
					}),
					input
				)
			)
			.query(async ({ input }) => {
				const organizationMembers = await clerkClient.organizations.getOrganizationMembershipList({
					organizationId: input.organizationId,
					limit: input.limit,
					offset: input.page * input.limit,
					orderBy: input.sort
				});
				return organizationMembers;
			}),
		createInviteForm: adminProcedure
			.input((input) => parse(object({
				organizationId: string()
			}), input))
			.query(async ({ input }) => {
				return await superValidate({
					organizationID: input.organizationId,
					redirectURL: PUBLIC_APP_URL
				},
					valibot(CreateOrgInviteRequestSchema),
					{ errors: false })
			}),
		updateRole: adminProcedure
			.input((input) => parse(object({
				organizationId: string(),
				userId: string(),
				role: union([literal("org:member"), literal("org:admin")])
			}), input))
			.mutation(async ({ input }) => {
				await clerkClient.organizations.updateOrganizationMembership(input)
			}),
		remove: adminProcedure
			.input((input) => parse(object({
				organizationId: string(),
				userId: string(),
				sendNotification: optional(boolean(), false)
			}), input))
			.mutation(
				async ({ input, ctx }) => {
					const createdOrgMembership = await clerkClient.organizations.deleteOrganizationMembership(input)

					if (input.sendNotification && createdOrgMembership.publicUserData?.identifier) {
						const remover = await clerkClient.users.getUser(ctx.session.userId);

						const result = await ctx.api.request("post", "/api/v2/notifications/org-member-removal", {
							body: {
								adminId: remover.id,
								organizationId: createdOrgMembership.organization.id,
								recipientEmail: createdOrgMembership.publicUserData?.identifier,
								userId: createdOrgMembership.publicUserData.userId,
								locale: "en"
							}
						})

						if (result.status !== 204) {
							throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The user could not be notified" })
						}
					}
				}


			),
		addMember: adminProcedure
			.input((input) => parse(object({
				organizationId: string(),
				userId: string(),
				sendNotification: optional(boolean(), false)
			}), input))
			.mutation(
				async ({ input, ctx }) => {
					const createdOrgMembership = await clerkClient.organizations.createOrganizationMembership({
						userId: input.userId,
						organizationId: input.organizationId,
						role: "org:member"
					})

					if (input.sendNotification && createdOrgMembership.publicUserData?.identifier) {
						const inviter = await clerkClient.users.getUser(ctx.session.userId);

						const result = await ctx.api.request("post", "/api/v2/notifications/org-member", {
							body: {
								adminId: inviter.id,
								organizationId: createdOrgMembership.organization.id,
								recipientEmail: createdOrgMembership.publicUserData?.identifier,
								userId: createdOrgMembership.publicUserData.userId,
								locale: "en"
							}
						})

						if (result.status !== 204) {
							throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "The user could not be notified" })
						}
					}
				}
			)
	}),
	list: adminProcedure
		.input((input) =>
			parse(
				object({
					query: string(),
					page: optional(number(), 0),
					limit: optional(number(), 10),
					includeMembersCount: optional(boolean(), false),
					orderBy: optional(
						union([
							literal('+name'),
							literal('+created_at'),
							literal('+members_count'),
							literal('-name'),
							literal('-created_at'),
							literal('-members_count'),
							literal('name'),
							literal('created_at'),
							literal('members_count')
						]),
						'+name'
					)
				}),
				input
			)
		)
		.query(async ({ input }) => {
			const data = await clerkClient.organizations.getOrganizationList({
				query: input.query.length > 0 ? input.query : undefined,
				offset: input.page * input.limit,
				limit: input.limit,
				includeMembersCount: input.includeMembersCount,
				orderBy: input.orderBy
			});
			const serializedData = makeSerializable(data.data);
			return {
				data: serializedData,
				totalCount: data.totalCount,
				page: input.page,
				limit: input.limit
			};
		}),
	getDetails: adminProcedure.input((input) => parse(object({
		organizationId: string()
	}), input))
		.query(async ({ input }) => {
			const org = await clerkClient.organizations.getOrganization({
				slug: input.organizationId,
				includeMembersCount: true
			});
			return makeSerializable(org);
		}),
	createForm: adminProcedure.query(async () => {
		return await superValidate(valibot(CreateOrgRequestSchema));
	})
});
