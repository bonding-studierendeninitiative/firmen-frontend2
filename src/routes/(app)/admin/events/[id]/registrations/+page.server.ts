import type { PageServerLoad } from './$types';
import { getEventRegistrations } from '$lib/services/eventRegistrations';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const response = await getEventRegistrations({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId: params.id
	});

	return {
		eventRegistrations: response.eventRegistrations ?? [],
		eventRegistrationsPageCount: response.totalPages,
		eventRegistrationsPage: response.pageNumber,
	};
};