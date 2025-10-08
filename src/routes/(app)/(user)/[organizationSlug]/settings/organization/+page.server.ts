import { auth } from '@/auth';

export const load = async (event) => {
	const { session, organization } = await event.parent();
	if (!session?.id) return;

	return {
		organization,
		hasPermission: await auth.api.hasPermission({
			body: {
				organizationId: organization.id,
				permission: {
					organization: ['delete', 'update']
				}
			},
			headers: {
				Authorization: `Bearer ${session.token}`
			}
		})
	};
};
