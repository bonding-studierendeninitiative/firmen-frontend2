import { query, command, form } from '$app/server';
import { createAdminContext } from '@/remote/context';
import { error } from '@sveltejs/kit';
import { object, string, nullish, number } from 'valibot';
import { CreateBuyOptionRequestSchema } from '@schema';
import { UpdateEventBuyOptionInput } from '@api/admin-client';

// Get all buy options
export const getBuyOptions = query(
	object({
		eventId: string(),
		page: nullish(number(), 0),
		limit: nullish(number(), 4),
		sortBy: nullish(string(), 'creationDate'),
		sortDirection: nullish(string(), 'desc')
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.get('/api/v2/admin/event/{eventId}/buy-option', {
			path: { eventId: input.eventId },
			query: {
				page: input.page,
				size: input.limit, // API expects 'size'
				sortBy: input.sortBy,
				sortDirection: input.sortDirection
			}
		});
		return response;
	}
);

// Get one buy option
export const getBuyOption = query(
	object({
		eventId: string(),
		buyOptionId: string()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.get(
			'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}',
			{
				path: {
					eventId: input.eventId,
					buyOptionId: input.buyOptionId
				}
			}
		);
		return response;
	}
);

// Create buy option form
export const createBuyOption = form(CreateBuyOptionRequestSchema, async (input) => {
	const ctx = await createAdminContext();

	const response = await ctx.adminApi.post('/api/v2/admin/event/{eventId}/buy-option', {
		path: { eventId: input.eventId },
		body: input
	});

	return { id: response.id };
});

// update buy option
export const updateBuyOption = form(
	object({
		data: UpdateEventBuyOptionInput,
		eventId: string(),
		buyOptionId: string()
	}),
	async (input) => {
		const ctx = await createAdminContext();

		const response = await ctx.adminApi.put(
			'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}',
			{
				path: { eventId: input.eventId, buyOptionId: input.buyOptionId },
				body: input.data
			}
		);
		await getBuyOptions({ eventId: input.eventId }).refresh();

		return response;
	}
);

// Delete buy option
export const deleteBuyOption = command(
	object({
		eventId: string(),
		buyOptionId: string()
	}),
	async ({ eventId, buyOptionId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'delete',
			'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}',
			{
				path: { eventId, buyOptionId }
			}
		);
		if (response.status !== 204) {
			error(404, 'Buy option not found');
		}
	}
);

// Activate buy option
export const activateBuyOption = command(
	object({
		eventId: string(),
		buyOptionId: string()
	}),
	async ({ eventId, buyOptionId }) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/activate',
			{
				path: { eventId, buyOptionId }
			}
		);
		if (response.status === 404) {
			error(404, 'No active buy option found.');
		}
		if (response.status !== 204 && response.status !== 200) {
			error(400, 'The buy option could not be activated.');
		}
	}
);
