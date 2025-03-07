import type {
	PageServerLoad
} from './$types';
import { clerkClient } from 'svelte-clerk/server';
import { getEventRegistrationsForOrganization } from '@/services';

export const load: PageServerLoad = async ({ parent, params, isDataRequest }) => {


	async function loadEventRegistrationData(slug: string) {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');
		const { eventRegistrations } = await getEventRegistrationsForOrganization({
			accessToken: token.jwt,
			organizationSlug: slug
		});

		return {
			eventRegistrations
		}
	}

	return {
		eventRegistrationData: isDataRequest ? loadEventRegistrationData(params.id) : await loadEventRegistrationData(params.id)
	}
}