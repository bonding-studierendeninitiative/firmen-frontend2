import { clerkClient } from 'svelte-clerk/server';
import { json } from '@sveltejs/kit';

export async function GET({ url }) {
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
