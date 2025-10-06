import { createLogger } from 'vite';
import { redirect } from '@sveltejs/kit';
import { auth } from '@/auth';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';

const logger = createLogger();

export const load = async (event) => {
	const { session } = await event.parent();

	if (session?.activeOrganizationId !== PUBLIC_BONDING_ORG_ID) {
		const checkPermission = await auth.api.userHasPermission({
			body: {
				role: 'admin',
				userId: session?.userId,
				permission: {
					user: ['create']
				}
			},
			headers: event.request.headers
		});

		if (checkPermission.error) return;

		if (checkPermission.success === false) {
			logger.info(
				`Can't access admin as member of org ${JSON.stringify(session?.activeOrganizationId)}`
			);
			redirect(302, '/');
		}
	}
};
