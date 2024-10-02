import {
	CreateEventRegistrationSchema,
	generateOrgInvite,
	getActiveBuyOption,
	getEvent,
	getOrganizationDetails
} from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { getContactPersonDetails } from '@/services/contactPerson';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getEventAddonPackages } from '@/services/eventAddonPackages';

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
		? url.searchParams.get('selectedPackage')
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

	const createEventRegistrationForm = await superValidate(valibot(CreateEventRegistrationSchema));
	createEventRegistrationForm.data.eventId = event.id;
	createEventRegistrationForm.data.organizationId = organization.id;
	createEventRegistrationForm.data.contactPersonId = contactPersonId;

	const selectedAddons: string[] = url.searchParams.has('selectedAddon')
		? url.searchParams.getAll('selectedAddon')
		: [];

	return {
		event,
		buyOption,
		selectedPackage,
		selectedAddons,
		createEventRegistrationForm,
		orgSlug: organization.slug,
		addons: addonPackages.addonPackages
	};
};

export const actions: Actions = {
	createEventReg: async ({ locals, request }) => {
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
		await generateOrgInvite({ accessToken: session?.accessToken, data: form.data });
		return { form };
	}
};
