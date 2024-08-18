import type { LayoutServerLoad } from './$types';
import { getEvent } from '@/services';

export const load: LayoutServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const event = await getEvent({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId: params.id
	});

	return { event };
};
