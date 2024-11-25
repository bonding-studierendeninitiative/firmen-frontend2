import type { PageServerLoad } from '../../../../../.svelte-kit/types/src/routes/(app)/admin/events/[id]/buy-options/[buyOptionId]/$types';
import { getOrganizationMembers, getOrgs } from '@/services';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const { organizations } = await getOrgs({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken
	});

	// const updateForm = await superValidate(buyOption, valibot(UpdateBuyOptionRequestSchema));
	// const createAddonPackageForm = await superValidate(valibot(CreateEventAddonPackageSchema));

	return {
		organizations
	};
};
