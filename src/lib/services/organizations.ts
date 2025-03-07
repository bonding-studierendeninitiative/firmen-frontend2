import { type SetOrgDetailsRequest } from '@schema';
import { error } from '@sveltejs/kit';
import type { InferOutput } from 'valibot';
import { clerkClient } from 'svelte-clerk/server';
import { makeSerializable } from '@/utils/serializable';



export const generateOrgInvite = async ({email, organizationID, role}: {email: string; organizationID: string; role: "org:admin" | "org:member"}) => {
	try {
		const orgInvite = await clerkClient.organizations.createOrganizationInvitation({
			organizationId: organizationID,
			emailAddress: email,
			inviterUserId: null, // TODO: Make PR for clerkClient Repo as it is not required.
			role: role
		})
		return makeSerializable(orgInvite);
	}catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
};

export const createOrganization = async ({name}: {name: string}) => {
	try {
		const organization = await clerkClient.organizations.createOrganization({name: name});

		return makeSerializable(organization);
	}catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
}


export type MembershipQueryData = { id: string, limit?: number, offset?: number, query?: string, orderBy?: string };


export const getOrganizationMembers = async ({ id, limit, offset, query, orderBy }: MembershipQueryData) => {
	try {
		const orgMemberships = await clerkClient.organizations.getOrganizationMembershipList({
			organizationId: id,
			limit: limit || 10,
			offset: offset || 0,
			query: query || "",
			orderBy: orderBy || undefined
		});

		return makeSerializable(orgMemberships);
	} catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
};

export const getOrgMemberships = async ({ userId }: { userId: string }) => {
	try {
		const memberships = await clerkClient.users.getOrganizationMembershipList({
			userId,
			limit: 10,
			offset: 0
		});

		return makeSerializable(memberships.data);
	} catch (e) {
		// @ts-expect-error the error likely has a message
		error(e.status || 500, e.message);
	}
};

export const getOrganizationDetails = async ({ slug }: { slug: string }) => {
	const org = await clerkClient.organizations.getOrganization({
		slug,
		includeMembersCount: true
	});
	return makeSerializable(org);
};

export const setOrgDetails = async ({
	orgId,
	data
}: {
	orgId: string;
	data: InferOutput<SetOrgDetailsRequest>;
}) => {
	await clerkClient.organizations.updateOrganizationMetadata(orgId, {
		publicMetadata: {
			...data
		}
	});
};

export type OrganizationsQueryData = { limit?: number, offset?: number, query?: string, orderBy?: string };

export const getOrgs = async ({ limit = 10, offset = 0, query="", orderBy="-created_at" }: OrgsQueryData) => {
	try {
		const organizations = await clerkClient.organizations.getOrganizationList({
			includeMembersCount: true,
			limit,
			offset,
			query,
			orderBy,
		});
		return makeSerializable(organizations);
	} catch (e) {
		error(e?.status || 500, e?.message);
	}
};
