import {
	getActiveBuyOption,
	getEvent,
	getOrganizationDetails,
	registerContactPersonToEvent
} from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { getContactPersonDetails } from '@/services/contactPerson';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getEventAddonPackages } from '@/services/eventAddonPackages';
import { ConfirmEventRegistrationSchema, CreateEventRegistrationSchema } from '@schema';

export const load: PageServerLoad = async ({ parent, params, url }) => {
	const { session } = await parent();
	if (!session?.user) return;
	const eventId = params.eventId;

	const event = await getEvent({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId
	});
	const buyOption = await getActiveBuyOption({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId
	});

	const selectedPackage = url.searchParams.has('selectedPackage')
		? (url.searchParams.get('selectedPackage') as string)
		: '';

	const organization = await getOrganizationDetails({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		slug: params.organizationSlug
	});

	const addonPackages = await getEventAddonPackages({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId: eventId,
		buyOptionId: buyOption.id
	});
	// @ts-expect-error we define accessToken in parent
	const { contactPersonId } = await getContactPersonDetails({ accessToken: session?.accessToken });

	const selectedAddons: string[] = url.searchParams.has('selectedAddon')
		? url.searchParams.getAll('selectedAddon')
		: [];

	const selectedAddonPackages: string[] = url.searchParams.has('selectedAddonPackage')
		? url.searchParams.getAll('selectedAddonPackage')
		: [];

	const createEventRegistrationForm = await superValidate(valibot(CreateEventRegistrationSchema));
	createEventRegistrationForm.data.eventId = event.id;
	createEventRegistrationForm.data.organizationId = organization.id;
	createEventRegistrationForm.data.contactPersonId = contactPersonId;
	createEventRegistrationForm.data.packageId = selectedPackage;
	createEventRegistrationForm.data.selectedAddons = selectedAddons;
	createEventRegistrationForm.data.selectedAddonPackages = selectedAddonPackages;

	const confirmEventRegistrationForm = await superValidate(valibot(ConfirmEventRegistrationSchema));

	return {
		event,
		buyOption,
		createEventRegistrationForm,
		confirmEventRegistrationForm,
		orgSlug: organization.slug,
		addonPackages: addonPackages.addonPackages
	};
};

export const actions: Actions = {
	createEventRegistration: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateEventRegistrationSchema));
		if (!form.valid) {
			return fail(400, { form });
		}
		// @ts-expect-error we define accessToken in parent
		await registerContactPersonToEvent({ accessToken: session?.accessToken, data: form.data });
		return { form };
	}
};
