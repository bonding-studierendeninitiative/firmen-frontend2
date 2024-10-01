import {
	CreateEventRegistrationSchema,
	generateOrgInvite,
	getAddonPackageTemplate,
	getBuyOption,
	getEvent,
	getOrganizationDetails
} from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateOrgInviteRequestSchema, SetOrgDetailsRequestSchema } from '@schema';
import { getContactPersonDetails } from '@/services/contactPerson';
import { url } from 'valibot';
import { type Actions, fail } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent, params, url }) => {
	const { session } = await parent();
	if (!session?.user) return;
	const eventId = params.eventId;

	const event = await getEvent({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId
		// orgSlug: params.organisationSlug
	});
	const buyOption = await getBuyOption({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId,
		buyOptionId: '688a0790-dc1b-42f4-8eb4-df0882246b04'
	});

	const selectedPackage = url.searchParams.has('selectedPackage')
		? url.searchParams.get('selectedPackage')
		: '';

	const organization = await getOrganizationDetails({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		slug: params.organisationSlug
	});

	const pkg = await getAddonPackageTemplate({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		addonPackageTemplateId: '4253a1bb-0c1a-4cbf-9809-d97af207f447'
	});
	const pkg2 = await getAddonPackageTemplate({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		addonPackageTemplateId: '2d9ce650-6834-4a6a-bc10-5aca63cf0fd7'
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
		addons: [pkg, pkg2]
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
		// @ts-expect-error
		await generateOrgInvite({ accessToken: session?.accessToken, data: form.data });
		return { form };
	}
};
