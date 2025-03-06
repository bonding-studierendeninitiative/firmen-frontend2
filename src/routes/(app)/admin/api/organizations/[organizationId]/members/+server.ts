import { clerkClient } from 'svelte-clerk/server';
import { json, error } from '@sveltejs/kit';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';

export async function GET({ params, locals }) {
	const { orgId } = locals.auth;
	if (orgId !== PUBLIC_BONDING_ORG_ID)
		error(403, {
			message: 'Forbidden'
		});
	try {
		// Fetch organization members from Clerk
		const organizationMembers = await clerkClient.organizations.getOrganizationMembershipList({
			organizationId: params.organizationId
		});
		return json(organizationMembers.data);
	} catch (error) {
		console.error('Error fetching organization members:', error);
		return json([]);
	}
}
