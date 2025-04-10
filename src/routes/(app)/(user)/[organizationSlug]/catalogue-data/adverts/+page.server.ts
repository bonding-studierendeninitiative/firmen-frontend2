import type { PageServerLoad } from './$types';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';
import { getOrgAdvertisements } from '@/services/advertisements';
import { UploadAdvertisementRequest } from '@schema';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { uploadAdvertisement } from '@/services';

export const load: PageServerLoad = async ({ parent, url, isDataRequest }) => {
	const page = url.searchParams.get('page') || '0';

	async function loadOrgAdvertisements() {
		const { initialState, organization } = await parent();
		if (!initialState?.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const org = await organization;

		const uploadAdvertisementForm = await superValidate(
			{
				orgId: org.id
			},
			valibot(UploadAdvertisementRequest),
			{
				errors: false
			}
		);

		const result = await getOrgAdvertisements({
			accessToken: token.jwt,
			organizationId: org.id,
			page
		});
		return {
			data: result,
			uploadForm: uploadAdvertisementForm
		};
	}

	return {
		advertisementData: isDataRequest ? loadOrgAdvertisements() : await loadOrgAdvertisements()
	};
};

export const actions = {
	uploadAdvertisement: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		const form = await superValidate(request, valibot(UploadAdvertisementRequest), {
			strict: true
		});
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		await uploadAdvertisement({
			accessToken: token.jwt,
			data: form.data
		});

		return withFiles({ form });
	}
};
