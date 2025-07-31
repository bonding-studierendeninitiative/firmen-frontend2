import { redirect } from '@sveltejs/kit';
import { createLogger } from 'vite';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { createCaller } from '@/trpc/router';

const logger = createLogger();

export const load = async (event) => {
	const { initialState, user } = await event.parent();
	if (!initialState?.orgId) {
		redirect(302, '/select-org');
	} else if (initialState?.orgId === PUBLIC_BONDING_ORG_ID) {
		logger.info('Member of bonding org detected. Redirecting to admin dashboard');
		redirect(302, '/admin');
	}

	const userMetaDataMissing = Object.keys(user?.publicMetadata).length === 0;
	if (userMetaDataMissing) {
		redirect(302, '/add-personal-details');
	}

	console.log('Organization slug:', event.params.organizationSlug);

	event.depends('organization');

	const api = await createCaller(event);

	const organization = await api.organizations.getDetails({
		slug: event.params.organizationSlug
	});

	if (!organization) {
		redirect(302, "/select-org")
	}

	return {
		organization
	};
};
