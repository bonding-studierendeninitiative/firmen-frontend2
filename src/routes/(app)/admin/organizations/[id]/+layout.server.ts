import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {

	const api = await createCaller(event);

	async function loadOrganizationDetails(id: string) {
		const organization = await api.organizations.getDetails({ slug: id });

		const is_bondingOrg = organization.id === PUBLIC_BONDING_ORG_ID
		return {
			organization,
			is_bonding: is_bondingOrg
		}
	}

	return {
		organizationDetails: event.isDataRequest ? loadOrganizationDetails(event.params.id) : await loadOrganizationDetails(event.params.id)
	}

};
