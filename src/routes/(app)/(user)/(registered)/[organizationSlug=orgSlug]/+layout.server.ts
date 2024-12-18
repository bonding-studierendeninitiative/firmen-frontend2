import { getOrganizationDetails, getOrgMemberships } from '@/services/organizations';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrganizationRequestSchema } from '@schema';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;
	const form = await superValidate(valibot(CreateOrganizationRequestSchema));

	return {
		form,
		organization: await getOrganizationDetails({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			slug: params.organizationSlug
		}),
		// @ts-expect-error we define accessToken in parent
		orgs: await getOrgMemberships({ accessToken: session?.accessToken })
	};
};
