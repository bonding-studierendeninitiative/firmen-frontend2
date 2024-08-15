import { handle as handleAuth } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import type { Handle } from '@sveltejs/kit';

const protectAdmin: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();
	if (
		// @ts-expect-error role was added in auth
		!['admin', 'dev', 'bonding'].includes(session?.user?.role) &&
		event.url.pathname.startsWith('/admin/')
	) {
		return new Response(null, {
			status: 302,
			headers: {
				location: '/'
			}
		});
	}
	return resolve(event);
};

export const handle = sequence(handleAuth, protectAdmin);
