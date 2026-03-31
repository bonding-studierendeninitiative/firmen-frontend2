export const load = async (event) => {
	const { organization } = await event.parent();
	return {
		orgId: organization.id
	};
};