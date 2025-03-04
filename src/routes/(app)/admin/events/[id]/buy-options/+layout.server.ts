import { getBuyOptions } from '@/services';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateBuyOptionRequestSchema } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { clerkClient } from 'svelte-clerk/server';

export const load = async ({ parent, params, isDataRequest }) => {
	async function loadBuyOptions(eventId: string) {
		const { initialState } = await parent();
		if (!initialState.sessionId) return;

		const token = await clerkClient.sessions.getToken(initialState.sessionId, 'access_token');

		const response = await getBuyOptions({
			accessToken: token.jwt,
			eventId
		});

		return {
			buyOptions: response.buyOptions,
			totalElements: response.totalElements
		};
	}

	const createForm = superValidate(valibot(CreateBuyOptionRequestSchema));

	return {
		buyOptionData: isDataRequest ? loadBuyOptions(params.id) : await loadBuyOptions(params.id),
		createForm: isDataRequest ? createForm : await createForm
	};
};
