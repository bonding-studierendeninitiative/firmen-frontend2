import type { PageServerLoad } from './$types';
import { getEvents } from '@/services';

export const load: PageServerLoad = async ({ parent }) => {
	const { session } = await parent();
	if (!session?.user) return;

	// @ts-expect-error we define accessToken in parent
	return { events: (await getEvents({ accessToken: session?.accessToken })) ?? [] };
};
