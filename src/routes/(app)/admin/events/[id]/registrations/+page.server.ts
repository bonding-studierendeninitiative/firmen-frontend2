import {
	AdminRegisterOrganizationToEventSchema,
	ExportCatalogueDataRequest,
	ReviewAdvertisementRequest,
	ReviewLogoRequest
} from '@schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import {
	exportAdvertisements,
	getEventRegistrationsForEvent,
	reviewAdvertisement,
	reviewLogo,
	adminCreateRegistration,
	exportLogos
} from '@/services';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';
import { createLogger } from 'vite';

const logger = createLogger();

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

	const reviewAdvertisementForm = await superValidate(valibot(ReviewAdvertisementRequest), {
		id: 'reviewAdvertisementForm'
	});
	const reviewLogoForm = await superValidate(valibot(ReviewLogoRequest), {
		id: 'reviewLogoForm'
	});
	const createRegistrationForm = await superValidate(
		{
			eventId: params.id
		},
		valibot(AdminRegisterOrganizationToEventSchema),
		{
			id: 'registerOrganizationForm',
			errors: false
		}
	);
	return {
		reviewAdvertisementForm,
		reviewLogoForm,
		createRegistrationForm,
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
	},
	exportCatalogueData: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const formData = await request.formData();

		console.log(`Exporting catalogue data`, formData);

		const form = await superValidate(formData, valibot(ExportCatalogueDataRequest));
		if (!form.valid) {
			return fail(400, { form });
		}

		logger.info('Exporting catalogue data');

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		if (form.data.documentType === 'advert') {
			await exportAdvertisements({
				accessToken: token.jwt,
				data: { ...form.data }
			});
		} else {
			await exportLogos({
				accessToken: token.jwt,
				data: { ...form.data }
			});
		}
	},
	createRegistration: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const formData = await request.formData();

		console.log(formData);

		const form = await superValidate(formData, valibot(AdminRegisterOrganizationToEventSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await adminCreateRegistration({
			accessToken: token.jwt,
			data: { ...form.data }
		});
	}
};
