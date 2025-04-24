import { ReviewAdvertisementRequest, ReviewLogoRequest } from '@schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import { getEventRegistrationsForEvent, reviewAdvertisement, reviewLogo } from '@/services';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, params, isDataRequest }) => {
	async function loadTableData() {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const { eventRegistrations, totalPages, pageNumber } = await getEventRegistrationsForEvent({
			accessToken: token.jwt,
			eventId: params.id
		});

		const packages = new Set(
			eventRegistrations
				.filter((value) => Boolean(value.purchasedPackage))
				.map((eventRegistration) => eventRegistration.purchasedPackage?.name)
		);
		const status = new Set(eventRegistrations.map((eventRegistration) => eventRegistration.status));
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
			eventRegistrations,
			totalPages,
			pageNumber,
			packages: [...packages],
			status: [...status],
			addonPackages: [...addonPackages],
			addons: [...addons]
		};
	}
	return {
		tableData: isDataRequest ? loadTableData() : await loadTableData()
	};
};

export const actions = {
	reviewAdvertisement: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const formData = await request.formData();

		const form = await superValidate(formData, valibot(ReviewAdvertisementRequest));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await reviewAdvertisement({
			accessToken: token.jwt,
			advertisementId: form.data.advertisementId,
			data: { ...form.data }
		});
	},
	reviewLogo: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const formData = await request.formData();

		const form = await superValidate(formData, valibot(ReviewLogoRequest));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await reviewLogo({
			accessToken: token.jwt,
			logoId: form.data.logoId,
			data: { ...form.data }
		});
	}
};
