import { getUnregisteredEvents } from '@/services/events';
import { getEventRegistrationsForOrganization, uploadCatalogueData } from '@/services';
import { fail, superValidate, withFiles } from 'sveltekit-superforms';
import { UploadCatalogueDataForm } from '@schema';

import { valibot } from 'sveltekit-superforms/adapters';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, url, isDataRequest }) => {
	const page = url.searchParams.get('page') || '0';
	const limit = url.searchParams.get('limit') || '10';

	async function loadEvents() {
		const { initialState, organization } = await parent();
		if (!initialState?.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const org = await organization;

		return (
			(await getUnregisteredEvents({
				accessToken: token.jwt,
				organizationId: org.id,
				page,
				limit
			})) ?? []
		);
	}

	async function loadDashboardData() {
		const { initialState, organization } = await parent();
		if (!initialState?.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const org = await organization;

		const eventRegistrations = await getEventRegistrationsForOrganization({
			accessToken: token.jwt,
			organizationSlug: org.slug,
			page,
			limit
		});

		const uploadCatalogueDataForm = await superValidate(
			{
				orgSlug: org.slug
			},
			valibot(UploadCatalogueDataForm),
			{
				errors: false
			}
		);

		return {
			page,
			limit,
			eventRegistrations,
			uploadCatalogueDataForm
		};
	}

	return {
		dashboardData: isDataRequest ? loadDashboardData() : await loadDashboardData(),
		events: isDataRequest ? loadEvents() : await loadEvents()
	};
};

export const actions = {
	uploadCatalogueData: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		const form = await superValidate(request, valibot(UploadCatalogueDataForm), {
			strict: true
		});
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		await uploadCatalogueData({
			accessToken: token.jwt,
			eventRegistrationId: form.data.eventRegistrationId,
			data: form.data
		});

		return withFiles({ form });
	}
};
