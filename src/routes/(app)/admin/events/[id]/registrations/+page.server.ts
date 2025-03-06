import {
	adminCreateRegistration,
	confirmEventRegistration,
	rejectEventRegistration
} from '@/services/adminEventRegistrations';
import {
	AdminRegisterOrganizationToEventSchema,
	ConfirmEventRegistrationSchema,
	ExportCatalogueDataRequest,
	RejectEventRegistrationSchema,
	ReviewCatalogueDataForm
} from '@schema';
import { valibot } from 'sveltekit-superforms/adapters';
import { superValidate } from 'sveltekit-superforms';
import { fail } from '@sveltejs/kit';
import {
	exportCatalogueData,
	getActiveBuyOption,
	getEventRegistrationsForEvent,
	reviewCatalogueData
} from '@/services';
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

		const activeBuyOption = await getActiveBuyOption({
			eventId: params.id,
			accessToken: token.jwt
		});

		return {
			eventRegistrations,
			totalPages,
			pageNumber,
			packages: [...packages],
			status: [...status],
			addonPackages: [...addonPackages],
			addons: [...addons],
			activeBuyOption
		};
	}

	const confirmForm = await superValidate(valibot(ConfirmEventRegistrationSchema), {
		id: 'confirmForm'
	});
	const rejectForm = superValidate(valibot(RejectEventRegistrationSchema), {
		id: 'rejectForm'
	});
	const reviewCatalogueDataForm = await superValidate(valibot(ReviewCatalogueDataForm), {
		id: 'reviewCatalogueDataForm'
	});
	const exportCatalogueDataForm = superValidate(valibot(ExportCatalogueDataRequest), {
		id: 'exportCatalogueDataForm'
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
		confirmForm,
		rejectForm: isDataRequest ? rejectForm : await rejectForm,
		reviewCatalogueDataForm,
		createRegistrationForm,
		exportCatalogueDataForm: isDataRequest
			? exportCatalogueDataForm
			: await exportCatalogueDataForm,
		tableData: isDataRequest ? loadTableData() : await loadTableData()
	};
};

export const actions = {
	confirmEventRegistration: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(ConfirmEventRegistrationSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await confirmEventRegistration({
			accessToken: token.jwt,
			eventRegistrationId: form.data.eventRegistrationId
		});
	},
	rejectEventRegistration: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(RejectEventRegistrationSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await rejectEventRegistration({
			accessToken: token.jwt,
			eventRegistrationId: form.data.eventRegistrationId
		});
	},
	reviewCatalogueData: async ({ locals, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const formData = await request.formData();

		const form = await superValidate(formData, valibot(ReviewCatalogueDataForm));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await reviewCatalogueData({
			accessToken: token.jwt,
			eventRegistrationId: form.data?.eventRegistrationId,
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

		const form = await superValidate(formData, valibot(ExportCatalogueDataRequest));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await exportCatalogueData({
			accessToken: token.jwt,
			data: { ...form.data }
		});
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
