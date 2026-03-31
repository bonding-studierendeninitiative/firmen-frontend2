import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getDetailsById } from '@/remote/functions';

export const load: PageServerLoad = async (event) => {
	const { session } = await event.parent();
	if (!session?.activeOrganizationId) {
		redirect(302, '/select-org');
	} else {
		const organization = await getDetailsById({
			id: session.activeOrganizationId
		});

		redirect(302, `/${organization?.slug}/dashboard`);
	}
};
