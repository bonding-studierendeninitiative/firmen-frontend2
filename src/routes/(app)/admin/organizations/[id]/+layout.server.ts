import { getOrganizationDetails } from '@/services';

export const load = async ({ parent, params, isDataRequest }) => {
	async function loadOrganizationDetails(id: string) {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const organization = await getOrganizationDetails({ slug: id});
		return {
			organization
		}
	}

	return {
		organizationDetails: isDataRequest ? loadOrganizationDetails(params.id) : await loadOrganizationDetails(params.id)
	}

};
