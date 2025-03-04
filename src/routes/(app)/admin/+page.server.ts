import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { initialState } = await parent();
	if (!initialState.sessionId) {
		return;
	}
	redirect(302, '/admin/dashboard');
};
