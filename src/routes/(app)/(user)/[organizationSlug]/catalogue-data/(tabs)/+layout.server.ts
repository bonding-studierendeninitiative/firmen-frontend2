export async function load({ parent }) {
	const { session, organization } = await parent();
	if (!session?.activeOrganizationId) return;

	return {
		orgSlug: organization.slug
	};
}
