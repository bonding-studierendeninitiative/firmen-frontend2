import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { EventDetailsResponseSchema } from '@schema';
import { createCaller } from '@/trpc/router';

export const load = async (event) => {

	const api = await createCaller(event);

	const eventDetails = await api.events.getDetails(event.params.id);

	const editEventForm = await superValidate(eventDetails, valibot(EventDetailsResponseSchema));

	return { event: eventDetails, editEventForm };
};
