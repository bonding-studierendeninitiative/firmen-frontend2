import { activateBuyOption, deleteBuyOption, getBuyOption, updateBuyOption } from '@/services';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UpdateBuyOptionRequestSchema } from '@schema';
import { fail, redirect } from '@sveltejs/kit';
import {
	createEventAddonPackage,
	deleteEventAddonPackage,
	getEventAddonPackages
} from '@/services/eventAddonPackages';
import { CreateEventAddonPackageSchema } from '@schema/eventAddonPackages';
import { type AuthObject, clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, params, isDataRequest, depends }) => {
	depends('buyOption');

	async function loadUpdateForm(eventId: string, buyOptionId: string) {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const buyOption = await getBuyOption({
			accessToken: token.jwt,
			buyOptionId: buyOptionId,
			eventId
		});

		return await superValidate(buyOption, valibot(UpdateBuyOptionRequestSchema));
	}

	async function loadAddonPackages(eventId: string, buyOptionId: string) {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const { addonPackages } = await getEventAddonPackages({
			accessToken: token.jwt,
			buyOptionId: buyOptionId,
			eventId
		});

		return addonPackages;
	}

	const createAddonPackageForm = superValidate(valibot(CreateEventAddonPackageSchema));

	return {
		addonPackages: isDataRequest
			? loadAddonPackages(params.id, params.buyOptionId)
			: await loadAddonPackages(params.id, params.buyOptionId),
		updateForm: isDataRequest
			? loadUpdateForm(params.id, params.buyOptionId)
			: await loadUpdateForm(params.id, params.buyOptionId),
		createAddonPackageForm: isDataRequest ? createAddonPackageForm : await createAddonPackageForm
	};
};

export const actions = {
	updateBuyOption: async ({ locals, request, params }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(UpdateBuyOptionRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await updateBuyOption({
			accessToken: token.jwt,
			data: form.data,
			eventId: params.id,
			buyOptionId: params.buyOptionId
		});
		return {
			form
		};
	},
	deleteBuyOption: async ({ locals, params }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await deleteBuyOption({
			accessToken: token.jwt,
			eventId: params.id,
			buyOptionId: params.buyOptionId
		});

		redirect(302, `/admin/events/${params.id}/buy-options`);
	},
	activateBuyOption: async ({ locals, params }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await activateBuyOption({
			buyOptionId: params.buyOptionId,
			eventId: params.id,
			accessToken: token.jwt
		});
	},
	createAddonPackage: async ({ locals, params, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateEventAddonPackageSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await createEventAddonPackage({
			accessToken: token.jwt,
			data: form.data,
			buyOptionId: params.buyOptionId,
			eventId: params.id
		});
		return {
			form
		};
	},
	deleteAddonPackage: async ({ locals, params: { buyOptionId, id }, request }) => {
		const session = locals.auth as unknown as AuthObject;
		if (!session || !session.sessionId) {
			fail(403);
			return;
		}

		const form = await request.formData();

		const addonPackageId = form.get('addonPackageId') ?? null;
		if (!addonPackageId || typeof addonPackageId !== 'string') {
			fail(400, { form });
			return;
		}

		const token = await clerkClient.sessions.getToken(session.sessionId, 'access_token');

		await deleteEventAddonPackage({
			accessToken: token.jwt,
			addonPackageId,
			buyOptionId,
			eventId: id
		});
	}
};
