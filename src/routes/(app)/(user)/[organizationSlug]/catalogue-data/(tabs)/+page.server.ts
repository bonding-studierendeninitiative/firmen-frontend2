import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { session, organization } = await parent();
	if (!session?.activeOrganizationId) {
		return;
	}

	redirect(302, `/${organization.slug}/catalogue-data/portraits`);
}
