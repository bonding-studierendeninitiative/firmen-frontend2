import { registerContactPersonToEvent } from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { ConfirmEventRegistrationSchema, CreateEventRegistrationSchema } from '@schema';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, url, isDataRequest }) => {
	const selectedPackage = url.searchParams.has('selectedPackage')
		? (url.searchParams.get('selectedPackage') as string)
		: '';

	const selectedAmountOfParticipationDays = Number(
		url.searchParams.has('selectedAmountOfParticipationDays')
			? (url.searchParams.get('selectedAmountOfParticipationDays') as string)
			: '1'
	);

	const selectedAddons: string[] = url.searchParams.has('selectedAddon')
		? url.searchParams.getAll('selectedAddon')
		: [];

	const selectedAddonPackages: string[] = url.searchParams.has('selectedAddonPackage')
		? url.searchParams.getAll('selectedAddonPackage')
		: [];

	const selectedEventDays: string[] = url.searchParams.has('selectedEventDays')
		? url.searchParams.getAll('selectedEventDays')
		: [];

	async function loadEventRegistrationData() {
		const { initialState, organization, eventDetails } = await parent();
		if (!initialState.sessionId) return;

		const org = await organization;

		const { event, buyOption, addons } = await eventDetails;

		const createEventRegistrationForm = await superValidate(
			{
				eventId: event.id,
				organizationId: org.id,
				contactPersonId: initialState.userId,
				packageId: selectedPackage,
				selectedAddons,
				selectedAddonPackages,
				selectedEventDays,
				selectedAmountOfParticipationDays
			},
			valibot(CreateEventRegistrationSchema),
			{
				errors: false
			}
		);

		const confirmEventRegistrationForm = await superValidate(
			valibot(ConfirmEventRegistrationSchema)
		);

		return {
			createEventRegistrationForm,
			confirmEventRegistrationForm,
			orgSlug: org.slug,
			event,
			buyOption,
			addons
		};
	}

	return {
		eventRegistrationData: isDataRequest
			? loadEventRegistrationData()
			: await loadEventRegistrationData()
	};
};

export const actions = {
	createEventRegistration: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateEventRegistrationSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await registerContactPersonToEvent({ accessToken: token.jwt, data: form.data });
		return { form };
	}
};
