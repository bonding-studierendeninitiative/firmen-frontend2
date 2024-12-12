import { handle as handleAuth } from './auth';
import { sequence } from '@sveltejs/kit/hooks';
import { type Handle, redirect } from '@sveltejs/kit';
import { contactPersonDetailsStore } from '@/stores/contactPersonStore';
import { get } from 'svelte/store';
import { getContactPersonDetails } from '@/services/contactPerson';
import { signOut } from '@auth/sveltekit/client';

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

const handleExpiredSession: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();
	if (!session) return resolve(event);

	const sessionExpires = new Date(session.expires);
	const currentDateTime = new Date();

	if (currentDateTime >= sessionExpires) {
		await signOut();
	}

	return resolve(event);
};

const forceContactPersonDetails: Handle = async ({ event, resolve }) => {
	const session = await event.locals.auth();

	// check if users is not logged in (handleAuth will do this)
	if (!session?.user) {
		return resolve(event);
	}

	// @ts-expect-error role was added in auth
	if (
		!['admin', 'dev', 'bonding'].includes(session?.user?.role) &&
		!event.url.pathname.includes('sign-up')
	) {
		const details = get(contactPersonDetailsStore);
		if (!details) {
			// @ts-expect-error define accessToke in auth
			const d = await getContactPersonDetails({ accessToken: session?.accessToken });
			if (!d) {
				return new Response(null, { status: 302, headers: { location: '/sign-up' } });
			}
		}
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
		return new Response(null, { status: 302, headers: { location: '/create-org' } });
	}

	return resolve(event);
};

export const handle = sequence(
	handleAuth,
	handleExpiredSession,
	protectAdmin,
	forceContactPersonDetails,
	forceOrganizationCreation
);
