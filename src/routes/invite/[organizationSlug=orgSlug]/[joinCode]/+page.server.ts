import type { PageServerLoad } from './$types';
import { acceptOrgInvite } from '@/services';
import { type AcceptInviteRequest } from '@schema';
import { redirect } from '@sveltejs/kit';
import type { InferInput } from 'valibot';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const organizationSlug = params.organizationSlug;
	const joinCode = params.joinCode;

	const request: InferInput<AcceptInviteRequest> = {
		organizationSlug,
		joinCode
	};
	// @ts-expect-error we define accessToken in parent
	const res = await acceptOrgInvite({ accessToken: session?.accessToken, data: request });

	if (res) redirect(302, `${organizationSlug}/dashboard`);

	return {};
};
