import type { PageServerLoad } from './$types';
import { getActiveBuyOption, getEvent } from '@/services';
import { getEventAddonPackages } from '@/services/eventAddonPackages';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;
	const eventId = params.eventId;

	// @ts-expect-error we define accessToken in parent
	const event = await getEvent({ accessToken: session?.accessToken, eventId });

	const buyOption = await getActiveBuyOption({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId
	});

	const addons = await getEventAddonPackages({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		buyOptionId: buyOption.id,
		eventId: eventId
	});

	return { event, buyOption, addons: addons.addonPackages, orgSlug: params.organizationSlug };
};
