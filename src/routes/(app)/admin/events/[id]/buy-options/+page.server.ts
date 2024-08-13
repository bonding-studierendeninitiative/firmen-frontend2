import { getBuyOptions, updateBuyOption } from '$lib/services';
import type { PageServerLoad } from './$types';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UpdateBuyOptionsRequestSchema } from '@schema';
import { fail } from '@sveltejs/kit';

export const load: PageServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const buyOption = await getBuyOptions({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId: params.id
	});

	const updateForm = await superValidate(buyOption, valibot(UpdateBuyOptionsRequestSchema));

	return {
		updateForm
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

		const form = await superValidate(request, valibot(UpdateBuyOptionsRequestSchema));
		if (!form.valid) {
			return fail(400, { form });
		}

		await updateBuyOption({
			// @ts-expect-error we define accessToken in parent
			accessToken: session?.accessToken, data: form.data, eventId: params.id
		});
		return {
			form
		};
	}
};
