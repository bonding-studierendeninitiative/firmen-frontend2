import type { PageServerLoad } from './$types';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';
import { UploadLogoRequest } from '@schema';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { uploadLogo } from '@/services';
import { createCaller } from '@/trpc/router';

export const load: PageServerLoad = async (event) => {
	const page = event.url.searchParams.get('page') || '0';

	const { organization } = await event.parent();

	const api = await createCaller(event);

	const org = await organization;

	const uploadLogoForm = await superValidate(
		{
			orgId: org.id
		},
		valibot(UploadLogoRequest),
		{
			errors: false
		}
	);

	return {
		data: api.catalogueData.logos.getAll({
			cursor: page
		}),
		uploadForm: uploadLogoForm
	};
};

export const actions = {
	uploadLogo: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		const form = await superValidate(request, valibot(UploadLogoRequest), {
			strict: true
		});
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		await uploadLogo({
			accessToken: token.jwt,
			data: form.data
		});

		return withFiles({ form });
	}
};
