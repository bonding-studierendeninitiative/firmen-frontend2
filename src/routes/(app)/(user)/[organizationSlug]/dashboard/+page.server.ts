import { getUnregisteredEvents } from '@/services/events';
import { getEventRegistrationsForOrganization } from '@/services';
import { clerkClient } from 'svelte-clerk/server';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UploadCatalogueDataForm } from '@schema';

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
