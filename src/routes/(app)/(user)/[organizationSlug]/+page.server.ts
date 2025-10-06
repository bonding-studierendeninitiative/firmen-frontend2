import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { session, organization } = await parent();
	if (!session?.activeOrganizationId) return;



	redirect(302, `/${organization.slug}/dashboard`);
}) satisfies PageServerLoad;
