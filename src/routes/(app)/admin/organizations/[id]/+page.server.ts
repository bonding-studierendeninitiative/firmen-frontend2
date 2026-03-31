import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { identifyOrg } from '@/remote/functions/admin';

export async function load(event) {
	const { session } = await event.parent();
	if (!session?.id) return;

	const organization = await identifyOrg({ slug: event.params.id });

	if (!organization) {
		return {
			organizationId: null,
			is_bondingOrg: false
		};
	}

	const is_bondingOrg = event.params.id === PUBLIC_BONDING_ORG_ID;

	return {
		organizationId: organization?.id,
		is_bondingOrg
	};
}
