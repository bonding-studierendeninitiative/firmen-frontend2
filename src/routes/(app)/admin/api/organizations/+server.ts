import { clerkClient } from 'svelte-clerk/server';
import { error, json } from '@sveltejs/kit';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';

export async function GET({ url, locals }) {
	const { orgId } = locals.auth;
	if (orgId !== PUBLIC_BONDING_ORG_ID)
		error(403, {
			message: 'Forbidden'
		});
	try {
		// Fetch organizations from Clerk
		const organizations = await clerkClient.organizations.getOrganizationList({
			query: url.searchParams.get('q') || undefined
		});
		return json(organizations.data);
	} catch (error) {
		console.error('Error fetching organizations:', error);
		return json([]);
	}
}
