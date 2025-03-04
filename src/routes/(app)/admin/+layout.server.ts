import { createLogger } from 'vite';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';

const logger = createLogger();

export const load = async ({ parent }) => {
	const { initialState } = await parent();
	if (!initialState.orgId) return;

	if (PUBLIC_BONDING_ORG_ID !== initialState.orgId) {
		logger.info(`Can't access admin as member of org ${JSON.stringify(initialState.orgId)}`);
		redirect(302, '/');
	}
};
