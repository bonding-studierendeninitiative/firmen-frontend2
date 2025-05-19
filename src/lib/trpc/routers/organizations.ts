import { authorizedOrgMemberProcedure, authorizedProcedure, router } from '@/trpc/server';
import { object, parse, string, number, union, literal } from 'valibot';
import { TRPCError } from '@trpc/server';
import { clerkClient } from 'svelte-clerk/server';
import { makeSerializable } from '@/utils/serializable';
import { SetOrgDetailsRequestSchema, type SetOrgDetailsRequest } from '@schema';

type WithSign<T extends string> = `-${T}` | `+${T}`;
type OrderByField = 'phone_number' | 'email_address' | 'created_at' | 'first_name' | 'last_name' | 'username';
type OrderBy = WithSign<OrderByField>;

export const organizationsRouter = router({
    generateInvite: authorizedProcedure
        .input((input) => parse(
            object({
                email: string(),
                organizationID: string(),
                role: union([literal('org:admin'), literal('org:member')])
            }),
            input
        ))
        .mutation(async ({ input }) => {
            try {
                const orgInvite = await clerkClient.organizations.createOrganizationInvitation({
                    organizationId: input.organizationID,
                    emailAddress: input.email,
                    inviterUserId: undefined,
                    role: input.role
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

    getMembers: authorizedProcedure
        .input((input) => parse(
            object({
                id: string(),
                limit: number(),
                offset: number(),
                query: string(),
                orderBy: string()
            }),
            input
        ))
        .query(async ({ input }) => {
            try {
                const orgMemberships = await clerkClient.organizations.getOrganizationMembershipList({
                    organizationId: input.id,
                    limit: input.limit,
                    offset: input.offset,
                    query: input.query,
                    orderBy: input.orderBy
                });
                return makeSerializable(orgMemberships);
            } catch (e) {
                throw new TRPCError({
                    code: 'INTERNAL_SERVER_ERROR',
                    message: e instanceof Error ? e.message : 'Failed to get organization members'
                });
            }
        }),

    getUserMemberships: authorizedProcedure
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

    getDetails: authorizedProcedure
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
            SetOrgDetailsRequestSchema,
            input
        ))
        .mutation(async ({ ctx, input }) => {
            try {
                await clerkClient.organizations.updateOrganizationMetadata(ctx.session.orgId, {
                    publicMetadata: {
                        ...input
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