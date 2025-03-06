import { clerkClient } from 'svelte-clerk/server';
import { getActiveBuyOption, getEvent } from '@/services';
import { getEventAddonPackages } from '@/services/eventAddonPackages';

export const load = async ({ parent, params, isDataRequest }) => {
	async function loadEventDetails(eventId: string, orgSlug: string) {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const event = await getEvent({ accessToken: token.jwt, eventId });

		const buyOption = await getActiveBuyOption({
			accessToken: token.jwt,
			eventId
		});

		const addons = await getEventAddonPackages({
			accessToken: token.jwt,
			buyOptionId: buyOption.id,
			eventId: eventId
		});

		return {
			event,
			buyOption,
			addons: addons.addonPackages,
			orgSlug
		};
	}

	return {
		eventDetails: isDataRequest
			? loadEventDetails(params.eventId, params.organizationSlug)
			: await loadEventDetails(params.eventId, params.organizationSlug)
	};
};
