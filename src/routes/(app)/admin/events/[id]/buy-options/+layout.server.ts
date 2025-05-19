import { valibot } from 'sveltekit-superforms/adapters';
import { CreateBuyOptionRequestSchema } from '@schema';
import { superValidate } from 'sveltekit-superforms';
import { createCaller } from '@/trpc/router.js';

export const load = async (event) => {

	const api = await createCaller(event);

	async function loadBuyOptions(eventId: string) {

		const response = await api.admin.events.buyOptions.getAll({
			eventId,
			page: "0",
			limit: "10"
		});

		return {
			buyOptions: response.buyOptions,
			totalElements: response.totalElements
		};
	}

	const createForm = superValidate(valibot(CreateBuyOptionRequestSchema));

	return {
		buyOptionData: event.isDataRequest ? loadBuyOptions(event.params.id) : await loadBuyOptions(event.params.id),
		createForm: event.isDataRequest ? createForm : await createForm
	};
};
