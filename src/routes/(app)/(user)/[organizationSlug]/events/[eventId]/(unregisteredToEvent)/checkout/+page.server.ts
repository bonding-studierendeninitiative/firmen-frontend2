import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { fail } from '@sveltejs/kit';
import { ConfirmEventRegistrationSchema, CreateEventRegistrationSchema } from '@schema';
import { RegisterOrganizationToEventInput } from '@api/client';
import { registerOrganizationToEvent } from '@/remote/functions';

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
		const { session, organization, eventDetails } = await parent();
		if (!session?.id) return;

		const { event, buyOption } = await eventDetails;

		const createEventRegistrationForm = await superValidate(
			{
				eventId: event.id,
				organizationId: organization.id,
				contactPersonId: session.userId,
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
			orgSlug: organization.slug,
			event,
			buyOption
		};
	}

	return {
		eventRegistrationData: isDataRequest
			? loadEventRegistrationData()
			: await loadEventRegistrationData()
	};
};

export const actions = {
	createEventRegistration: async (event) => {
		const form = await superValidate(event.request, valibot(RegisterOrganizationToEventInput));
		if (!form.valid) {
			return fail(400, { form });
		}

		await registerOrganizationToEvent(form.data);
		return { form };
	}
};
