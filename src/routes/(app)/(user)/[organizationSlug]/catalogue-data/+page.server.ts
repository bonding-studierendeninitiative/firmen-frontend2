import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { initialState, organization } = await parent();
	if (!initialState.orgId) {
		return;
	}

	const org = await organization;
	redirect(302, `/${org.slug}/catalogue-data/portraits`);
}
