import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const { initialState } = await parent();
	if (initialState.orgId) {
		redirect(302, `/${initialState.orgSlug}/dashboard`);
	}
};
