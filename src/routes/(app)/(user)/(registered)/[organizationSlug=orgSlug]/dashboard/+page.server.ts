import type { PageServerLoad } from './$types';
import { getEvents } from '@/services/events';
import { getEventRegistrationsForOrganization } from '@/services';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

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
		eventRegistrations
	};
};
