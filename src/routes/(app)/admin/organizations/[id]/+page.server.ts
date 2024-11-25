import type { PageServerLoad } from './$types';
import {
	getEventRegistrationsForOrganization,
	getOrganizationDetails,
	getOrganizationMembers,
	getPortraitTemplates
} from '@/services';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const { members } = await getOrganizationMembers({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		slug: params.id
	});

	const organization = await getOrganizationDetails({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		slug: params.id
	});

	const { portraitTemplates } = await getPortraitTemplates({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		org: params.id
	});

	const { eventRegistrations } = await getEventRegistrationsForOrganization({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		organizationSlug: params.id
	});

	// const updateForm = await superValidate(buyOption, valibot(UpdateBuyOptionRequestSchema));
	// const createAddonPackageForm = await superValidate(valibot(CreateEventAddonPackageSchema));

	return {
		orgMembers: members,
		organization,
		portraitTemplates,
		eventRegistrations
	};
};
