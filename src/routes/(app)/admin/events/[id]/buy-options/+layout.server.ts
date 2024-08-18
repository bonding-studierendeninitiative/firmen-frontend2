import { getBuyOptions } from '$lib/services';
import type { LayoutServerLoad } from './$types';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateBuyOptionRequestSchema } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ parent, params }) => {
	const { session } = await parent();
	if (!session?.user) return;

	const response = await getBuyOptions({
		// @ts-expect-error we define accessToken in parent
		accessToken: session?.accessToken,
		eventId: params.id
	});

	if (response.buyOptions.length > 0 && !params.buyOptionId) {
		redirect(302, `/admin/events/${params.id}/buy-options/${response.buyOptions[0].id}`);
	}

	const createForm = await superValidate(valibot(CreateBuyOptionRequestSchema));

	return {
		buyOptions: response.buyOptions,
		buyOptionCount: response.totalElements,
		createForm
	};
};
