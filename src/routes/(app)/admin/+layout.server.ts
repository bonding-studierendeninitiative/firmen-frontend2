import { createLogger } from 'vite';
import { redirect } from '@sveltejs/kit';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { createCaller } from '@/trpc/router';

const logger = createLogger();

export const load = async (event) => {
	const api = await createCaller(event);
	const { initialState } = await event.parent();
	if (!initialState.orgId) return;

	if (PUBLIC_BONDING_ORG_ID !== initialState.orgId) {
		logger.info(`Can't access admin as member of org ${JSON.stringify(initialState.orgId)}`);
		redirect(302, '/');
	}

	function loadJobs() {
		return api.admin.jobs({
			limit: '10',
			offset: '0',
			stateName: 'SUCCEEDED'
		});
	}

	return {
		jobs: event.isDataRequest ? loadJobs() : await loadJobs()
	};
};
