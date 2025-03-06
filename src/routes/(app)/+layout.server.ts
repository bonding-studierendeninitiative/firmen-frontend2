import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load = (async ({ parent }) => {
	const { initialState } = await parent();

	if (!initialState.userId) {
		redirect(302, '/sign-in');
	}
}) satisfies LayoutServerLoad;
