import type { LayoutServerLoad } from './$types';
import { getOrgs } from '@/services';

export const load: LayoutServerLoad = async ({ parent, url }) => {
	const { initialState } = await parent();
	if (!initialState.sessionId) return;

	const organizations = await getOrgs({
		limit: Number(url.searchParams.get('limit') || '10'),
		offset: Number(url.searchParams.get('offset') || '0')
	});

	console.log(organizations);

	return {
		organizations
	};
};
