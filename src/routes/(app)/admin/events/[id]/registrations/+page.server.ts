import type { Actions, PageServerLoad } from './$types';
import {
	confirmEventRegistration,
	getEventRegistrationsForEvent,
	rejectEventRegistration
} from '$lib/services/eventRegistrations';
import {
	ConfirmEventRegistrationSchema,
	RejectEventRegistrationSchema,
	ReviewCatalogueDataForm
} from '@schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { reviewCatalogueData } from '@/services';
import { ReviewCatalogueData } from '@/@svelte/modules';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const { eventRegistrations, totalPages, pageNumber } = await getEventRegistrationsForEvent({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId: params.id
	});

	const confirmForm = await superValidate(valibot(ConfirmEventRegistrationSchema), {
		id: 'confirmForm'
	});
	const rejectForm = await superValidate(valibot(RejectEventRegistrationSchema), {
		id: 'rejectForm'
	});
	const reviewCatalogueDataForm = await superValidate(valibot(ReviewCatalogueDataForm), {
		id: 'reviewCatalogueDataForm'
	});

	const packages = new Set(
		eventRegistrations.map((eventRegistration) => eventRegistration.purchasedPackage.name)
	);
	const status = new Set(
		eventRegistrations.map((eventRegistration) => eventRegistration.status?.text)
	);
	const addonPackages = new Set(
		eventRegistrations.flatMap((eventRegistration) =>
			eventRegistration.addonPackages.map((addonPackages) => addonPackages.title)
		)
	);
	const addons = new Set<string>(
		eventRegistrations.flatMap((eventRegistration) =>
			eventRegistration.addonPackages.flatMap((addonPackages) =>
				addonPackages.addons.map((addon) => addon.title)
			)
		)
	);

	return {
		confirmForm,
		rejectForm,
		reviewCatalogueDataForm,
		packages: [...packages],
		status: [...status],
		addonPackages: [...addonPackages],
		addons: [...addons],
		eventRegistrations: eventRegistrations ?? [],
		eventRegistrationsPageCount: totalPages,
		eventRegistrationsPage: pageNumber
	};
};

export const actions: Actions = {
	confirmEventRegistration: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(ConfirmEventRegistrationSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await confirmEventRegistration({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			eventRegistrationId: form.data.eventRegistrationId
		});
	},
	rejectEventRegistration: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(RejectEventRegistrationSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await rejectEventRegistration({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			eventRegistrationId: form.data.eventRegistrationId
		});
	},
	reviewCatalogueData: async ({ locals, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const formData = await request.formData();

		const form = await superValidate(formData, valibot(ReviewCatalogueDataForm));
		if (!form.valid) {
			return fail(400, { form });
		}

		await reviewCatalogueData({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			eventRegistrationId: form.data?.eventRegistrationId,
			data: { ...form.data }
		});
	}
};
