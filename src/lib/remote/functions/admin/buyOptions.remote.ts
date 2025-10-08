import { query, command, form } from '$app/server';
import { createAdminContext } from '@/remote/context';
import { error } from '@sveltejs/kit';
import {
	object,
	string,
	nullish,
	number,
	optional,
	array,
	union,
	literal,
	boolean,
	nonEmpty,
	pipe
} from 'valibot';
import { CreateBuyOptionRequestSchema } from '@schema';
import { Problem } from '@api/admin-client';

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

const EventDayInput = object({
	dayDate: optional(string()),
	remainingCapacity: optional(number()),
	totalCapacity: optional(number())
});

const PackageBenefitInput = object({
	numericValue: optional(number()),
	stringValue: optional(string()),
	booleanValue: optional(boolean())
});

const PackageInput = object({
	name: string(),
	price: number(),
	benefits: array(PackageBenefitInput)
});

const ServiceInput = object({
	name: string(),
	description: optional(string(), ''),
	valueType: union([literal('STRING'), literal('INTEGER'), literal('BOOLEAN')])
});

const UpdateEventBuyOption = object({
	packages: optional(array(PackageInput), []),
	services: optional(array(ServiceInput), []),
	eventDays: optional(array(EventDayInput), []),
	name: pipe(string(), nonEmpty()),
	allowedSignUpDays: optional(number(), 1)
});

// update buy option
export const updateBuyOption = form(
	object({
		data: UpdateEventBuyOption,
		eventId: string(),
		buyOptionId: string()
	}),
	async (input) => {
		const ctx = await createAdminContext();

		const response = await ctx.adminApi.request(
			'put',
			'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}',
			{
				path: { eventId: input.eventId, buyOptionId: input.buyOptionId },
				body: input.data
			}
		);

		if (response.status !== 200) {
			const problem = (await response.json()) as Problem;
			console.error('Error updating buy option:', problem);
			error(500, problem.detail || 'The buy option could not be updated');
		}

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
