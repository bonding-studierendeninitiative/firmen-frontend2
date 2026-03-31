import { redirect } from '@sveltejs/kit';

export const load = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.id) {
		return;
	}
	redirect(302, '/admin/dashboard');
};
