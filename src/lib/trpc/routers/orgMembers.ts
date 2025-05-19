import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { object, parse, string, union } from 'valibot';
import { TRPCError } from '@trpc/server';
import { clerkClient } from 'svelte-clerk/server';
import { makeSerializable } from '@/utils/serializable';
import type { SetOrgDetailsRequest } from '@schema';

type WithSign<T extends string> = `-${T}` | `+${T}`;
type MemberOrderBy = WithSign<'phone_number' | 'email_address' | 'created_at' | 'first_name' | 'last_name' | 'username'>;
type OrgOrderBy = WithSign<'name' | 'created_at' | 'members_count'>;

export const orgMembersRouter = router({
	generateInvite: authorizedOrgMemberProcedure
		.input((input) => parse(
			object({
				email: string(),
				organizationID: string(),
				role: union([string(), string()])
			}),
			input
		))
		.mutation(async ({ input }) => {
			try {
				const orgInvite = await clerkClient.organizations.createOrganizationInvitation({
					organizationId: input.organizationID,
					emailAddress: input.email,
					inviterUserId: '',
					role: input.role as 'org:admin' | 'org:member'
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
		.input((input) => parse(
			object({
				name: string()
			}),
			input
		))
		.mutation(async ({ input }) => {
			try {
				const organization = await clerkClient.organizations.createOrganization({ name: input.name });
				return makeSerializable(organization);
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to create organization'
				});
			}
		}),
	getMembers: authorizedOrgMemberProcedure
		.input((input) => parse(
			object({
				id: string(),
				limit: string(),
				offset: string(),
				query: string(),
				orderBy: string()
			}),
			input
		))
		.query(async ({ input }) => {
			try {
				const orgMemberships = await clerkClient.organizations.getOrganizationMembershipList({
					organizationId: input.id,
					limit: Number(input.limit) || 10,
					offset: Number(input.offset) || 0,
					orderBy: input.orderBy as MemberOrderBy || undefined
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
		.input((input) => parse(
			object({
				userId: string()
			}),
			input
		))
		.query(async ({ input }) => {
			try {
				const memberships = await clerkClient.users.getOrganizationMembershipList({
					userId: input.userId,
					limit: 10,
					offset: 0
				});
				return makeSerializable(memberships.data);
			} catch (e) {
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: e instanceof Error ? e.message : 'Failed to get user memberships'
				});
			}
		}),
	getDetails: authorizedOrgMemberProcedure
		.input((input) => parse(
			object({
				slug: string()
			}),
			input
		))
		.query(async ({ input }) => {
			try {
				const org = await clerkClient.organizations.getOrganization({
					slug: input.slug,
					includeMembersCount: true
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
		.input((input) => parse(
			object({
				orgId: string(),
				data: object({}) // TODO: Add proper schema validation
			}),
			input
		))
		.mutation(async ({ input }) => {
			try {
				await clerkClient.organizations.updateOrganizationMetadata(input.orgId, {
					publicMetadata: {
						...input.data
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
		.input((input) => parse(
			object({
				limit: string(),
				offset: string(),
				query: string(),
				orderBy: string()
			}),
			input
		))
		.query(async ({ input }) => {
			try {
				const organizations = await clerkClient.organizations.getOrganizationList({
					includeMembersCount: true,
					limit: Number(input.limit) || 10,
					offset: Number(input.offset) || 0,
					query: input.query || '',
					orderBy: input.orderBy as OrgOrderBy || '-created_at'
				});
				return makeSerializable(organizations);
			} catch (e) {
				console.error(e instanceof Error ? e.message : 'Unknown error');
				return {
					data: [],
					totalCount: 0
				};
			}
		})
});
