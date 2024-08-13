import type { LayoutServerLoad } from './$types';
import { getOrganizationDetails, getOrgMemberships } from '$lib/services/organizations';

export const load: LayoutServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	return {
		organization: await getOrganizationDetails({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			slug: params.organisationSlug
		}),
		// @ts-expect-error we define accessToken in parent
		orgs: await getOrgMemberships({ accessToken: session?.accessToken })
	};
};