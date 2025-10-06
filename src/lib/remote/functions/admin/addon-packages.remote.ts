import { command, form, query } from '$app/server';
import { createAdminContext } from '@/remote/context';
import { error } from '@sveltejs/kit';
import { object, string, number, nullish } from 'valibot';
import { superValidate } from 'sveltekit-superforms/client';
import { valibot } from 'sveltekit-superforms/adapters';
import { CreateEventAddonPackageSchema } from '@schema/eventAddonPackages';

// Addon Packages
export const getAddonPackages = query(
	object({
		eventId: string(),
		buyOptionId: string(),
		page: nullish(number(), 0),
		limit: nullish(number(), 6)
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.get(
			'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package',
			{
				path: {
					eventId: input.eventId,
					buyOptionId: input.buyOptionId
				},
				query: {
					page: input.page,
					limit: input.limit
				}
			}
		);
		return response;
	}
);

export const getAddonPackage = query(
	object({
		addonPackageId: string(),
		eventId: string(),
		buyOptionId: string()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.get(
			'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}',
			{
				path: input,
				query: { includeAddons: true }
			}
		);
		return response;
	}
);

export const createAddonPackageForm = query(
	object({
		buyOptionId: string(),
		eventId: string()
	}),
	({ buyOptionId, eventId }) => {
		return superValidate(
			{
				buyOptionId,
				eventId
			},
			valibot(CreateEventAddonPackageSchema),
			{
				errors: false
			}
		);
	}
);

export const createAddonPackage = form(CreateEventAddonPackageSchema, async (input) => {
	const ctx = await createAdminContext();

	const response = await ctx.adminApi.post(
		'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package',
		{
			path: { eventId: input.eventId, buyOptionId: input.buyOptionId },
			body: input
		}
	);
	return { data: response };
});

export const deleteAddonPackage = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		addonPackageId: string()
	}),
	async ({ eventId, buyOptionId, addonPackageId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'delete',
			'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}',
			{
				path: {
					eventId,
					buyOptionId,
					addonPackageId
				}
			}
		);

		if (response.status !== 204) {
			error(404, 'Addon package not found');
		}
	}
);
