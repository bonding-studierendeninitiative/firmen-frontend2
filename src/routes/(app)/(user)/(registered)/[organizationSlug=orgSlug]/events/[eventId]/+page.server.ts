import type { PageServerLoad } from './$types';
import { getActiveBuyOption, getEvent } from '@/services';
import { getEventAddonPackages } from '@/services/eventAddonPackages';

export const load: PageServerLoad = async ({ parent, params, url }) => {
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
	const selectedAddons: string[] = url.searchParams.has('selectedAddon')
		? url.searchParams.getAll('selectedAddon')
		: [];


	const selectedPackageID = url.searchParams.has('selectedPackage')
		? (url.searchParams.get('selectedPackage') as string)
		: '';


	const addons = await getEventAddonPackages({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		buyOptionId: buyOption.id,
		eventId: eventId,
	});

	return { event, buyOption, addons: addons.addonPackages, orgSlug: params.organizationSlug, selectedAddons, selectedPackageID };
};
