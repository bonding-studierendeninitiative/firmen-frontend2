import { redirect } from '@sveltejs/kit';
import { createLogger } from 'vite';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { getDetails } from '@/remote/functions/organizations.remote.js';

const logger = createLogger();

export async function load(event) {
	const { session, user } = await event.parent();
	if (user?.banned) {
		redirect(302, '/banned');
	}
	if (!session?.activeOrganizationId) {
		redirect(302, '/select-org');
	} else if (session?.activeOrganizationId === PUBLIC_BONDING_ORG_ID) {
		logger.info('Member of bonding org detected. Redirecting to admin dashboard');
		redirect(302, '/admin');
	}

    const userMetaDataMissing = Object.keys(user?.metadata ?? {}).length === 0;
	if (userMetaDataMissing) {
		redirect(302, '/add-personal-details');
	}

	console.log('Organization slug:', event.params.organizationSlug);

	event.depends('organization');

	const organization = await getDetails({
		slug: event.params.organizationSlug!
	});

	if (!organization) {
		redirect(302, '/select-org');
	}

	return {
		organization
	};
}
