import type { PageServerLoad } from './$types';
import {
	CreateEventRegistrationSchema,
	getAddonPackageTemplate,
	getBuyOption,
	getEvent,
	getOrganizationDetails
} from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { SetOrgDetailsRequestSchema } from '@schema';
import { getContactPersonDetails } from '@/services/contactPerson';
import { url } from 'valibot';

export const load: PageServerLoad = async ({ parent, params, url }) => {
	const { session } = await parent();
	if (!session?.user) return;
	const eventId = params.eventId;

	// @ts-expect-error we define accessToken in parent
	const event = await getEvent({
		accessToken: session?.accessToken,
		eventId,
		orgSlug: params.organisationSlug
	});
	// @ts-expect-error we define accessToken in parent
	const buyOption = await getBuyOption({
		accessToken: session?.accessToken,
		eventId,
		buyOptionId: '688a0790-dc1b-42f4-8eb4-df0882246b04'
	});

	let selectedPackage = url.searchParams.has('selectedPackage') ? url.searchParams.get('selectedPackage') : "";

	const organization = await getOrganizationDetails({
    accessToken: session?.accessToken,
    slug: params.organisationSlug
  });

	// @ts-expect-error we define accessToken in parent
	const pkg = await getAddonPackageTemplate({accessToken: session?.accessToken, addonPackageTemplateId: "4253a1bb-0c1a-4cbf-9809-d97af207f447"})
	// @ts-expect-error we define accessToken in parent
	const pkg2 = await getAddonPackageTemplate({accessToken: session?.accessToken, addonPackageTemplateId: "2d9ce650-6834-4a6a-bc10-5aca63cf0fd7"})
// @ts-expect-error we define accessToken in parent
	const contactPerson = await getContactPersonDetails({accessToken: session?.accessToken});

	const createEventRegistrationForm = await superValidate(valibot(CreateEventRegistrationSchema));
	createEventRegistrationForm.data.eventId = event.id;
	createEventRegistrationForm.data.organizationId = organization.id;
	createEventRegistrationForm.data.contactPersonId = contactPerson.contactPersonId;


	let selectedAddons: string[] = url.searchParams.has("selectedAddon")? url.searchParams.getAll('selectedAddon') : []


	return { event, buyOption, selectedPackage, selectedAddons,  createEventRegistrationForm, orgSlug: organization.slug,  addons: [pkg, pkg2]  };
};
