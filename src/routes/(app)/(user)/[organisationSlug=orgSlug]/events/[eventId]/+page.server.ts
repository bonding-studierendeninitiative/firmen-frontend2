import type {PageServerLoad} from "./$types"
import { getAddonPackageTemplate, getAddonPackageTemplates, getBuyOption, getEvent } from '@/services';

export const load: PageServerLoad = async({parent, params}) => {
	const { session } = await parent();
	if (!session?.user) return;
	const eventId = params.eventId;

	// @ts-expect-error we define accessToken in parent
	const event = await getEvent({ accessToken: session?.accessToken, eventId  });
	// @ts-expect-error we define accessToken in parent
	const pkg = await getAddonPackageTemplate({accessToken: session?.accessToken, addonPackageTemplateId: "4253a1bb-0c1a-4cbf-9809-d97af207f447"})
	// @ts-expect-error we define accessToken in parent
	const pkg2 = await getAddonPackageTemplate({accessToken: session?.accessToken, addonPackageTemplateId: "2d9ce650-6834-4a6a-bc10-5aca63cf0fd7"})


	// @ts-expect-error we define accessToken in parent
	const buyOption = await getBuyOption({accessToken: session?.accessToken, eventId, buyOptionId: "688a0790-dc1b-42f4-8eb4-df0882246b04"})


	return { event, buyOption, orgSlug: params.organisationSlug, packages: [pkg, pkg2] };
}