import { getEvent } from '@/services';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { EventDetailsResponseSchema } from '@schema';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const event = await getEvent({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId: params.id
	});

	const editEventForm = await superValidate(event, valibot(EventDetailsResponseSchema));

	return { event, editEventForm };
};
