import type { LayoutServerLoad } from './$types';
import { get } from 'svelte/store';
import { contactPersonDetailsStore } from '@/stores/contactPersonStore';
import { getContactPersonDetails } from '@/services/contactPerson';
import { redirect } from '@sveltejs/kit';
import { createLogger } from 'vite';

const logger = createLogger();

export const load = (async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user) return;

	if (
		// @ts-expect-error role was added in auth
		!['admin', 'dev', 'bonding'].includes(session?.user?.role)
	) {
		const details = get(contactPersonDetailsStore);
		if (!details) {
			// @ts-expect-error define accessToke in auth
			const d = await getContactPersonDetails({ accessToken: session?.accessToken });
			if (!d) {
				logger.info('User is not yet registered. Redirecting to sign up.');
				redirect(302, '/sign-up');
			}
		}
	}
}) satisfies LayoutServerLoad;
