import { redirect } from '@sveltejs/kit';

export const load = async ({ parent, url }) => {
	const { initialState } = await parent();

	if (!initialState.userId) {
		const redirectTo = url.pathname+url.search
		const searchParams = new URLSearchParams({
			redirectTo
		})
		redirect(302, `/sign-in?${searchParams}`);
	}
};
