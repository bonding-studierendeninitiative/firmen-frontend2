import type { PageServerLoad } from './$types';
import { clerkClient } from 'svelte-clerk/server';
import { getOrgAdvertisements } from '@/services/advertisements';

export const load: PageServerLoad = async ({ parent, url, isDataRequest }) => {
	const page = url.searchParams.get('page') || '0';

	async function loadOrgAdvertisements() {
		const { initialState, organization } = await parent();
		if (!initialState?.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const org = await organization;

		const result = await getOrgAdvertisements({
			accessToken: token.jwt,
			organizationId: org.id,
			page
		});
		return result.advertisements;
	}

	return {
		advertisements: isDataRequest ? loadOrgAdvertisements() : await loadOrgAdvertisements()
	};
};
