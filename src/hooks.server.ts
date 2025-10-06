import * as Sentry from '@sentry/sveltekit';
import { auth } from './lib/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';

// hooks.server.ts
import type { Handle } from '@sveltejs/kit';

Sentry.init({
	dsn: 'https://f1933902b8f781edc8b707ee9d75ea53@o4508733953540096.ingest.de.sentry.io/4508733955571792',
	tracesSampleRate: 1,
	environment: process.env.NODE_ENV
});

const handleSession: Handle = async ({ event, resolve }) => {
	event.locals.session = await auth.api.getSession({
		headers: event.request.headers
	});
	return resolve(event);
};

// Custom hook to handle GitHub users and make them admins
async function handleGitHubAdmin({ event, resolve }: { event: any; resolve: any }) {
	// Check if this is a GitHub OAuth callback
	if (
		event.url.pathname.includes('/api/auth/callback/github') &&
		event.url.searchParams.has('code')
	) {
		const response = await resolve(event);

		// After the auth callback is processed, check if the user signed in with GitHub
		try {
			const session = event.locals.session;

			if (session?.user) {
				// Check if this user has GitHub as a provider
				const accounts = await auth.api.listUserAccounts({
					query: { userId: session.user.id }
				});

				const hasGitHubAccount = accounts?.some((account: any) => account.provider === 'github');

				if (hasGitHubAccount) {
					try {
						// Check if user is already a member of bonding organization
						const orgMembers = await auth.api.listMembers({
							query: {
								organizationId: PUBLIC_BONDING_ORG_ID,
								limit: 1000,
								offset: 0
							}
						});

						const isMember = orgMembers.members?.some(
							(member: any) => member.userId === session.user.id
						);

						if (!isMember) {
							// Add user to bonding organization as an admin
							await auth.api.addMember({
								body: {
									organizationId: PUBLIC_BONDING_ORG_ID,
									userId: session.user.id,
									role: 'admin'
								}
							});
							console.log(
								`Added GitHub user ${session.user.email} as admin to bonding organization`
							);
						}
					} catch (error) {
						console.error('Error adding GitHub user to admin organization:', error);
					}
				}
			}
		} catch (error) {
			console.error('Error checking GitHub authentication:', error);
		}

		return response;
	}

	return resolve(event);
}

export const handle = sequence(
	Sentry.sentryHandle(),
	handleSession,
	handleGitHubAdmin,
	({ event, resolve }) => {
		return svelteKitHandler({ event, resolve, auth, building });
	}
);
export const handleError = Sentry.handleErrorWithSentry();
