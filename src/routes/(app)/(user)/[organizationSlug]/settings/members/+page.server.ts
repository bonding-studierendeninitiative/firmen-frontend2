export const load = async (event) => {
	const { session, organization } = await event.parent();
	if (!session?.id) return;

	return {
		organization
	};
};
