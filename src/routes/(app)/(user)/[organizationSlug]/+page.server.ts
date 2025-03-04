import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { initialState } = await parent();
	if (!initialState.orgId) return;
	redirect(302, `/${initialState.orgSlug}/dashboard`);
}) satisfies PageServerLoad;
