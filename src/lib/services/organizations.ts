import { type SetOrgDetailsRequest } from '@schema';
import { error } from '@sveltejs/kit';
import type { InferOutput } from 'valibot';
import { clerkClient } from 'svelte-clerk/server';
import { makeSerializable } from '@/utils/serializable';

export const generateOrgInvite = async ({
	accessToken,
	data
}: {
	accessToken: string;
	data: unknown;
}) => {
	// TODO do something with clerk
};

export const getOrganizationMembers = async ({ slug }: { slug: string }) => {
	try {
		const orgMemberships = await clerkClient.organizations.getOrganizationMembershipList({
			organizationId: slug,
			limit: 10,
			offset: 0
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

export const getOrgs = async ({ limit = 10, offset = 0 }: { limit?: number; offset?: number }) => {
	try {
		const organizations = await clerkClient.organizations.getOrganizationList({
			includeMembersCount: true,
			limit,
			offset
		});
		return makeSerializable(organizations.data);
	} catch (e) {
		error(e?.status || 500, e?.message);
	}
};
