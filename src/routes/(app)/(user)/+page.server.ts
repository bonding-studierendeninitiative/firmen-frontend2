import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent }) => {
	const { initialState, user } = await parent();
	if (!user?.publicMetadata) {
		redirect(302, '/add-personal-details');
	} else if (!initialState.orgId) {
		redirect(302, '/create-org');
	} else {
		redirect(302, `/${initialState.orgSlug}/dashboard`);
	}
};
