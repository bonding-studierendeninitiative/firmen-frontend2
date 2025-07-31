import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { UpdateBuyOptionRequestSchema } from '@schema';
import { fail } from '@sveltejs/kit';
import { CreateEventAddonPackageSchema } from '@schema/eventAddonPackages';
import { createCaller } from '@/trpc/router.js';
import { AddAddonPackageInput, UpdateEventBuyOptionInput } from '@api/admin-client.js';

export const load = async (event) => {
	event.depends('buyOption');

	const api = await createCaller(event);

	async function loadUpdateForm(eventId: string, buyOptionId: string) {
		const buyOption = await api.admin.events.buyOptions.getOne({
			buyOptionId: buyOptionId,
			eventId
		});

		return await superValidate(
			buyOption,
			valibot(UpdateEventBuyOptionInput, {
				undefinedStrategy: 'null'
			}),
			{
				errors: false
			}
		);
	}

	async function loadAddonPackages(eventId: string, buyOptionId: string) {
		const { addonPackages } = await api.admin.events.addonPackages.getAll({
			buyOptionId: buyOptionId,
			eventId,
			page: '0',
			limit: '10'
		});

		return addonPackages;
	}

	const createAddonPackageForm = superValidate(valibot(CreateEventAddonPackageSchema));

	return {
		addonPackages: event.isDataRequest
			? loadAddonPackages(event.params.id, event.params.buyOptionId)
			: await loadAddonPackages(event.params.id, event.params.buyOptionId),
		updateForm: event.isDataRequest
			? loadUpdateForm(event.params.id, event.params.buyOptionId)
			: await loadUpdateForm(event.params.id, event.params.buyOptionId),
		createAddonPackageForm: event.isDataRequest
			? createAddonPackageForm
			: await createAddonPackageForm
	};
};

export const actions = {
	updateBuyOption: async (event) => {
		const form = await superValidate(event.request, valibot(UpdateEventBuyOptionInput));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.admin.events.buyOptions.update({
			data: form.data,
			eventId: event.params.id,
			buyOptionId: event.params.buyOptionId
		});
		return {
			form
		};
	},
	createAddonPackage: async (event) => {
		const form = await superValidate(event.request, valibot(AddAddonPackageInput));
		if (!form.valid) {
			return fail(400, { form });
		}

		const api = await createCaller(event);

		await api.admin.events.addonPackages.create({
			data: form.data,
			buyOptionId: event.params.buyOptionId,
			eventId: event.params.id
		});
		return {
			form
		};
	}
};
