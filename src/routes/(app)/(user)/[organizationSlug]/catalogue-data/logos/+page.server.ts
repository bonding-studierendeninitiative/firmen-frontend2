import type { PageServerLoad } from './$types';
import { clerkClient } from 'svelte-clerk/server';
import { getOrgLogos } from '@/services';

export const load: PageServerLoad = async ({ parent, url, isDataRequest }) => {
	const page = (url.searchParams.get('page') || '0') as `${number}`;

	async function loadOrgLogos() {
		const { initialState, organization } = await parent();
		if (!initialState?.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const org = await organization;

		const result = await getOrgLogos({
			accessToken: token.jwt,
			organizationId: org.id,
			page
		});

		return result.logos;
	}

	return {
		logos: isDataRequest ? loadOrgLogos() : await loadOrgLogos()
	};
};
