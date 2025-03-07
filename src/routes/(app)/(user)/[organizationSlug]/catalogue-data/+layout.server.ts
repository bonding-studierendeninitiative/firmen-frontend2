export async function load({ parent }) {
	const { initialState } = await parent();
	if (!initialState.orgSlug) return;

	return {
		orgSlug: initialState.orgSlug
	};
}
