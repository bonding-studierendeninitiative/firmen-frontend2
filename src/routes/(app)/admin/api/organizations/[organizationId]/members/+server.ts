import { clerkClient } from 'svelte-clerk/server';
import { json } from '@sveltejs/kit';

export async function GET({ params }) {
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
