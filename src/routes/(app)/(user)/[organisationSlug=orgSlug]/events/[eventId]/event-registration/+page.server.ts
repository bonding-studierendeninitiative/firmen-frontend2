import type {PageServerLoad} from "./$types"
import { getEvent } from '@/services';

export const load: PageServerLoad = async({parent, params}) => {
	const { session } = await parent();
	if (!session?.user) return;
	const eventId = params.eventId;

	// @ts-expect-error we define accessToken in parent
	return { event: await getEvent({ accessToken: session?.accessToken, eventId }) ?? [] };
}