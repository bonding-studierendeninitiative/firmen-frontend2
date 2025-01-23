import type { Actions, PageServerLoad } from './$types';
import { getEvents } from '@/services/events';
import { getEventRegistrationsForOrganization, uploadCatalogueData } from '@/services';
import { superValidate, withFiles, fail } from 'sveltekit-superforms';
import { UploadCatalogueDataForm } from '@schema';

// Import every translation for a specific language
import '@valibot/i18n/de';
import { valibot } from 'sveltekit-superforms/adapters';
import { get } from 'svelte/store';
import { locale } from '@services';

export const load: PageServerLoad = async ({ parent, params, url }) => {
	const { session } = await parent();
	if (!session?.user) return;

	// Extract pagination parameters from the URL //TODO: Integrate with backend!!
	const page = Number(url.searchParams.get('page') || '0'); // default to page 0
	const limit = Number(url.searchParams.get('limit') || '10'); // default to 10 items per page

	const eventRegistrations = await getEventRegistrationsForOrganization({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		organizationSlug: params.organizationSlug
	});

	const uploadCatalogueDataForm = await superValidate(valibot(UploadCatalogueDataForm));

	const eventsToHide = eventRegistrations.eventRegistrations.map(
		(eventRegistration) => eventRegistration.event.id
	);

	// @ts-expect-error we define accessToken in parent
	const events = (await getEvents({ accessToken: session?.accessToken })) ?? [];
	return {
		events: events.filter((event) => !eventsToHide.includes(event.id)),
		page,
		limit,
		eventRegistrations,
		uploadCatalogueDataForm
	};
};

export const actions: Actions = {
	uploadCatalogueData: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(UploadCatalogueDataForm), {
			strict: true
		});
		if (!form.valid) {
			return fail(400, withFiles({ form }));
		}

		await uploadCatalogueData({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			eventRegistrationId: form.data.eventRegistrationId,
			data: form.data
		});

		return withFiles({ form });
	}
};
