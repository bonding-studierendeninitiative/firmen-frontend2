import { handle as handleAuth } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import { type Handle } from '@sveltejs/kit';
import { contactPersonDetailsStore } from '@/stores/contactPersonStore';
import { get } from 'svelte/store';
import { signOut } from '@auth/sveltekit/client';
import { createLogger } from 'vite';

const logger = createLogger();

const protectAdmin: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();
	logger.info(
		`Protecting request to ${event.url.pathname} for session ${JSON.stringify(session?.user)}.`
	);
	if (
		// @ts-expect-error role was added in auth
		!['admin', 'dev', 'bonding'].includes(session?.user?.role) &&
		event.url.pathname.startsWith('/admin/')
	) {
		logger.info(
			`Protected request to ${event.url.pathname} for session ${JSON.stringify(session?.user)}`
		);
		return new Response(null, {
			status: 302,
			headers: {
				location: '/admin'
			}
		});
	}
	return resolve(event);
};

const handleExpiredSession: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();
	if (!session) return resolve(event);

	const sessionExpires = new Date(session.expires);
	const currentDateTime = new Date();

	if (currentDateTime >= sessionExpires) {
		logger.info(`Handling an expired session ${session}, signing the user out\u2026`);
		await signOut();
	}

	return resolve(event);
};

const forceOrganizationCreation: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();
	const details = get(contactPersonDetailsStore);

	// @ts-expect-error role was added in auth
	if (['admin', 'dev', 'bonding'].includes(session?.user?.role)) return resolve(event);

	// details do not exist -> person not registered/logged in
	if (!details) {
		return resolve(event);
	}

	if (details.organizationMemberships.length == 0 && !event.url.pathname.includes('create-org')) {
		logger.info('User is not member of an organization. Redirecting to org creation.');

		return new Response(null, { status: 302, headers: { location: '/create-org' } });
	}

	return resolve(event);
};

export const handle = sequence(
	handleAuth,
	handleExpiredSession,
	protectAdmin,
	forceOrganizationCreation
);
