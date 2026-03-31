export const load = async (event) => {
	const { organization } = await event.parent();
	return {
		orgSlug: event.params.organizationSlug,
		orgId: organization.id
	};
};
