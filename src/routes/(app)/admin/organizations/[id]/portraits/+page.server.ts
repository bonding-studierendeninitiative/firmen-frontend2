import type {
	PageServerLoad
} from './$types';
import { clerkClient } from 'svelte-clerk/server';
import { getPortraitTemplates } from '@/services';

export const load: PageServerLoad = async ({ parent, params, isDataRequest, url }) => {
	async function loadPortraitData(slug: string) {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const { portraitTemplates } = await getPortraitTemplates({
			accessToken: token.jwt,
			org: slug
		});

		return {
			portraitTemplates
		}
	}

	return {
		portraitData: isDataRequest ? loadPortraitData(params.id) : await loadPortraitData(params.id)
	}
}