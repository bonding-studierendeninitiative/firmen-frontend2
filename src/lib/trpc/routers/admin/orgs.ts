import { adminProcedure, router } from '@/trpc/server';
import { boolean, literal, nullish, number, object, optional, parse, pipe, string, union } from 'valibot';
import { clerkClient } from 'svelte-clerk/server';
import { CreateOrgInviteRequestSchema, CreateOrgRequestSchema } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { makeSerializable } from '@/utils';
import { PUBLIC_APP_URL } from '$env/static/public';

export const adminOrgsRouter = router({
	members: router({
		getAll: adminProcedure
			.input((input) =>
				parse(
					object({
						organizationId: string(),
						limit: nullish(number(), 10),
						page: nullish(number(), 0),
						sort: nullish(string(), "+first_name")
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
				userId: string()
			}), input))
			.mutation(
				async ({ input }) => {
					await clerkClient.organizations.deleteOrganizationMembership(input)
				}
			),
		addMember: adminProcedure
			.input((input) => parse(object({
				organizationId: string(),
				userId: string()
			}), input))
			.mutation(
				async ({ input }) => {
					await clerkClient.organizations.createOrganizationMembership({ ...input, role: "org:member" })
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
