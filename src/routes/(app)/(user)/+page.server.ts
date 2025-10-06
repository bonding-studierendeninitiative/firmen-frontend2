import type { PageServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { createCaller } from '@/trpc/router';

export const load: PageServerLoad = async (event) => {
	const { session } = await event.parent();
	if (!session?.activeOrganizationId) {
		redirect(302, '/select-org');
	} else {
		const api = await createCaller(event);

		const organization = await api.organizations.getDetailsById({
			id: session.activeOrganizationId
		});

		redirect(302, `/${organization?.slug}/dashboard`);
	}
};
