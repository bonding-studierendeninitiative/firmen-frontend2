import type { PageServerLoad } from './$types';
import { getEvents } from '@/services/events';
import { getEventRegistrationsForOrganization } from '@/services';

export const load: PageServerLoad = async ({ parent, params, url }) => {
	const { session } = await parent();
	if (!session?.user) return;

	// Extract pagination parameters from the URL //TODO: Integrate with backend!!
	const page = Number(url.searchParams.get('page') || '0'); // default to page 0
	const limit = Number(url.searchParams.get('limit') || '10'); // default to 10 items per page

	const eventRegistrations = await getEventRegistrationsForOrganization({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		organizationSlug: params.organizationSlug
	});

	const eventsToHide = eventRegistrations.eventRegistrations.map(
		(eventRegistration) => eventRegistration.event.id
	);

	// @ts-expect-error we define accessToken in parent
	const events = (await getEvents({ accessToken: session?.accessToken })) ?? [];
	return {
		events: events.filter((event) => !eventsToHide.includes(event.id)),
		page,
		limit,
		eventRegistrations
	};
};
