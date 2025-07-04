import { redirect } from '@sveltejs/kit';
import { createLogger } from 'vite';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { createCaller } from '@/trpc/router';

const logger = createLogger();

export const load = async (event) => {
	const { initialState } = await event.parent();
	if (!initialState?.orgId) {
		redirect(302, '/select-org');
	} else if (initialState?.orgId === PUBLIC_BONDING_ORG_ID) {
		logger.info('Member of bonding org detected. Redirecting to admin dashboard');
		redirect(302, '/admin');
	}

	console.log('Organization slug:', event.params.organizationSlug);

	event.depends('organization');

	const api = await createCaller(event);

	const organization = api.organizations.getDetails({
		slug: event.params.organizationSlug
	});
	return {
		organization
	};
};
