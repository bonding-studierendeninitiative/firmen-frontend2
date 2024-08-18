import { activateBuyOption, deleteBuyOption, getBuyOption, updateBuyOption } from '$lib/services';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UpdateBuyOptionRequestSchema } from '@schema';
import { fail, redirect } from '@sveltejs/kit';
import { createEventAddonPackage, getEventAddonPackages } from '@/services/eventAddonPackages';
import { CreateEventAddonPackageSchema } from '@schema/eventAddonPackages';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const buyOption = await getBuyOption({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		buyOptionId: params.buyOptionId,
		eventId: params.id
	});

	const addonPackages = await getEventAddonPackages({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		buyOptionId: params.buyOptionId,
		eventId: params.id
	});

	const updateForm = await superValidate(buyOption, valibot(UpdateBuyOptionRequestSchema));
	const addonPackageForm = await superValidate(valibot(CreateEventAddonPackageSchema));

	return {
		addonPackages: addonPackages.addonPackages,
		updateForm,
		addonPackageForm
	};
};

export const actions = {
	updateBuyOption: async ({ locals, request, params }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(UpdateBuyOptionRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await updateBuyOption({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			data: form.data,
			eventId: params.id,
			buyOptionId: params.buyOptionId
		});
		return {
			form
		};
	},
	deleteBuyOption: async ({ locals, params }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		await deleteBuyOption({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			eventId: params.id,
			buyOptionId: params.buyOptionId
		});

		redirect(302, `/admin/events/${params.id}/buy-options`);
	},
	activateBuyOption: async ({ locals, params }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		await activateBuyOption({
			buyOptionId: params.buyOptionId,
			eventId: params.id,
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken
		});
	},
	createAddonPackage: async ({ locals, params, request }) => {
		const session = await locals.auth();
		// @ts-expect-error we define accessToken in parent
		if (!session || !session.accessToken) {
			fail(403);
			return;
		}

		const form = await superValidate(request, valibot(CreateEventAddonPackageSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await createEventAddonPackage({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken,
			data: form.data,
			buyOptionId: params.buyOptionId,
			eventId: params.id
		});
		return {
			form
		};
	}
};
