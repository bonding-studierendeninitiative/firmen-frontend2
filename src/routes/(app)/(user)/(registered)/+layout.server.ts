import type { LayoutServerLoad } from './types';
import { getContactPersonDetails } from '@/services/contactPerson';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ parent, url }) => {
	const { session } = await parent();

	/*
	const details = await getContactPersonDetails({ accessToken: session?.accessToken });

	if (!details && !url.pathname.includes("admin") && !url.pathname.includes('sign-up')) {
		redirect(302, '/sign-up');
	}
*/
	return {
		session
	};
};
