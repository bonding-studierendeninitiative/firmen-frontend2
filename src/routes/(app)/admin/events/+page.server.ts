import type { PageServerLoad } from './$types';
import { getEvents } from '$lib/services/events';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user) return;

	return {
		// @ts-expect-error we define accessToken in parent
		publishedEvents: (await getEvents({ accessToken: session?.accessToken })) ?? [],
		// @ts-expect-error we define accessToken in parent
		unpublishedEvents:
			(await getEvents({ accessToken: session?.accessToken, status: 'UNPUBLISHED' })) ?? [],
		// @ts-expect-error we define accessToken in parent
		archivedEvents:
			(await getEvents({ accessToken: session?.accessToken, status: 'ARCHIVED' })) ?? []
	};
};
