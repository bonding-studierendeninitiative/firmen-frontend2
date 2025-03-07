import { redirect } from '@sveltejs/kit';

export async function load({ parent }) {
	const { initialState } = await parent();
	if (!initialState.orgSlug) {
		return;
	}

	redirect(302, `/${initialState.orgSlug}/catalogue-data/portraits`);
}
