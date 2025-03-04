import { getOrganizationDetails } from '@/services/organizations';
import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { createLogger } from 'vite';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';

const logger = createLogger();

export const load: LayoutServerLoad = async ({ parent, params, depends }) => {
	const { initialState } = await parent();
	if (!initialState?.orgId) {
		redirect(302, '/create-org');
	} else if (initialState?.orgId === PUBLIC_BONDING_ORG_ID) {
		logger.info('Member of bonding org detected. Redirecting to admin dashboard');
		redirect(302, '/admin');
	}

	console.log('Organization slug:', params.organizationSlug);

	depends('organization');

	const organization = getOrganizationDetails({
		slug: params.organizationSlug
	});
	return {
		organization
	};
};
