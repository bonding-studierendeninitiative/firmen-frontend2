import { query, command, form } from '$app/server';
import { createAdminContext } from '@/remote/context';
import { error, redirect } from '@sveltejs/kit';
import {
	object,
	string,
	nullish,
	number,
	optional,
	union,
	literal,
	boolean,
	minLength,
	transform,
	pipe
} from 'valibot';
import {
	CreateBuyOptionRequestSchema,
	UpdateEventDayInput,
	CreateBuyOptionEventDayInput
} from '@schema';
import {
	CreateEventDayOutput,
	CreatePackageOutput,
	CreateServiceOutput,
	Problem,
	UpdateEventDayOutput,
	UpdatePackageOutput,
	UpdateServiceOutput,
	CreateBenefitOutput
} from '@api/admin-client';

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

export const updateBuyOptionName = form(
	object({
		eventId: string(),
		buyOptionId: string(),
		name: string(),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'patch',
			'/api/v2/admin/buy-option/{buyOptionId}/metadata/change-name',
			{
				path: {
					buyOptionId: input.buyOptionId
				},
				body: {
					name: input.name,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 200) {
			const problem = (await response.json()) as Problem;
			console.error('Error updating buy option name:', problem);
			error(500, problem.detail || 'The buy option name could not be updated');
		}
		const result = (await response.json()) as UpdateEventDayOutput;
		return { id: result.id };
	}
);

export const changeAllowedSignUpDays = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		allowedSignUpDays: number(),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'patch',
			'/api/v2/admin/buy-option/{buyOptionId}/metadata/change-allowed-signup-days',
			{
				path: {
					buyOptionId: input.buyOptionId
				},
				body: {
					allowedSignUpDays: input.allowedSignUpDays,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (!response.ok) {
			const problem = (await response.json()) as Problem;
			console.error('Error updating event day:', problem);
			error(
				problem.status?.statusCode || 500,
				problem.detail || 'The event day could not be updated'
			);
		}
		const result = (await response.json()) as UpdateEventDayOutput;

		await getBuyOption({ eventId: input.eventId, buyOptionId: input.buyOptionId }).refresh();

		return { id: result.id };
	}
);

export const createBuyOptionEventDay = form(CreateBuyOptionEventDayInput, async (input) => {
	const ctx = await createAdminContext();
	const response = await ctx.adminApi.request(
		'post',
		'/api/v2/admin/buy-option/{buyOptionId}/event-day',
		{
			path: {
				buyOptionId: input.buyOptionId
			},
			body: {
				date: input.date,
				totalCapacity: input.totalCapacity,
				version: input.version
			}
		}
	);
	if (response.status === 303) {
		redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
	}
	if (response.status !== 201) {
		const problem = (await response.json()) as Problem;
		console.error('Error creating event day:', problem);
		error(500, problem.detail || 'The event day could not be created');
	}
	const result = (await response.json()) as CreateEventDayOutput;
	return { id: result.id };
});

export const updateBuyOptionEventDay = form(UpdateEventDayInput, async (input) => {
	const ctx = await createAdminContext();
	const response = await ctx.adminApi.request(
		'put',
		'/api/v2/admin/buy-option/{buyOptionId}/event-day/{eventDayId}',
		{
			path: {
				buyOptionId: input.buyOptionId,
				eventDayId: input.eventDayId
			},
			body: {
				date: input.date,
				totalCapacity: input.totalCapacity,
				version: input.version
			}
		}
	);
	if (response.status === 303) {
		redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
	}
	if (response.status !== 200) {
		const problem = (await response.json()) as Problem;
		console.error('Error updating event day:', problem);
		error(500, problem.detail || 'The event day could not be updated');
	}
	const result = (await response.json()) as UpdateEventDayOutput;
	return { id: result.id };
});

export const deleteBuyOptionEventDay = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		eventDayId: string(),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'delete',
			'/api/v2/admin/buy-option/{buyOptionId}/event-day/{eventDayId}',
			{
				path: {
					buyOptionId: input.buyOptionId,
					eventDayId: input.eventDayId
				},
				query: {
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 204) {
			const problem = (await response.json()) as Problem;
			console.error('Error deleting event day:', problem);
			error(500, problem.detail || 'The event day could not be deleted');
		}
	}
);
export const moveBuyOptionEventDay = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		eventDayId: string(),
		direction: union([literal('up'), literal('down')]),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/buy-option/{buyOptionId}/event-day/{eventDayId}/move',
			{
				path: {
					buyOptionId: input.buyOptionId,
					eventDayId: input.eventDayId
				},
				body: {
					direction: input.direction,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 204) {
			const problem = (await response.json()) as Problem;
			console.error('Error moving event day:', problem);
			error(500, problem.detail || 'The event day could not be moved');
		}
	}
);

export const createBuyOptionService = form(
	object({
		eventId: string(),
		buyOptionId: string(),
		name: string(),
		description: optional(string(), ''),
		valueType: union([literal('STRING'), literal('INTEGER'), literal('BOOLEAN')]),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/buy-option/{buyOptionId}/service',
			{
				path: {
					buyOptionId: input.buyOptionId
				},
				body: {
					name: input.name,
					description: input.description,
					valueType: input.valueType,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 201) {
			const problem = (await response.json()) as Problem;
			console.error('Error creating service:', problem);
			error(500, problem.detail || 'The service could not be created');
		}
		const result = (await response.json()) as CreateServiceOutput;
		return { id: result.id };
	}
);

export const updateBuyOptionService = form(
	object({
		eventId: string(),
		buyOptionId: string(),
		serviceId: string(),
		name: string(),
		description: optional(string(), ''),
		valueType: union([literal('STRING'), literal('INTEGER'), literal('BOOLEAN')]),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'put',
			'/api/v2/admin/buy-option/{buyOptionId}/service/{serviceId}',
			{
				path: {
					buyOptionId: input.buyOptionId,
					serviceId: input.serviceId
				},
				body: {
					name: input.name,
					description: input.description,
					valueType: input.valueType,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 200) {
			const problem = (await response.json()) as Problem;
			console.error('Error updating service:', problem);
			error(500, problem.detail || 'The service could not be updated');
		}
		const result = (await response.json()) as UpdateServiceOutput;
		return { id: result.id };
	}
);

export const deleteBuyOptionService = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		serviceId: string(),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'delete',
			'/api/v2/admin/buy-option/{buyOptionId}/service/{serviceId}',
			{
				path: {
					buyOptionId: input.buyOptionId,
					serviceId: input.serviceId
				},
				query: {
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 204) {
			const problem = (await response.json()) as Problem;
			console.error('Error deleting service:', problem);
			error(500, problem.detail || 'The service could not be deleted');
		}
	}
);
export const moveBuyOptionService = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		serviceId: string(),
		direction: union([literal('up'), literal('down')]),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/buy-option/{buyOptionId}/service/{serviceId}/move',
			{
				path: {
					buyOptionId: input.buyOptionId,
					serviceId: input.serviceId
				},
				body: {
					direction: input.direction,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 200) {
			const problem = (await response.json()) as Problem;
			console.error('Error moving service:', problem);
			error(500, problem.detail || 'The service could not be moved');
		}
	}
);

export const createBuyOptionPackage = form(
	object({
		eventId: string(),
		buyOptionId: string(),
		name: pipe(
			string('Paketname ist erforderlich'),
			transform((name) => name.trim()),
			minLength(1, 'Der Paketname darf nicht leer sein')
		),
		price: optional(number(), 0),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/buy-option/{buyOptionId}/package',
			{
				path: {
					buyOptionId: input.buyOptionId
				},
				body: {
					name: input.name,
					price: input.price,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 201) {
			const problem = (await response.json()) as Problem;
			console.error('Error creating package:', problem);
			error(500, problem.detail || 'The package could not be created');
		}
		const result = (await response.json()) as CreatePackageOutput;
		return { id: result.id };
	}
);

export const updateBuyOptionPackage = form(
	object({
		eventId: string(),
		buyOptionId: string(),
		packageId: string(),
		name: string(),
		price: number(),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'put',
			'/api/v2/admin/buy-option/{buyOptionId}/package/{packageId}',
			{
				path: {
					buyOptionId: input.buyOptionId,
					packageId: input.packageId
				},
				body: {
					name: input.name,
					price: input.price,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 200) {
			const problem = (await response.json()) as Problem;
			console.error('Error updating package:', problem);
			error(
				problem.status?.statusCode ?? 500,
				problem.detail || 'The package could not be updated'
			);
		}
		const result = (await response.json()) as UpdatePackageOutput;
		return { id: result.id };
	}
);

export const deleteBuyOptionPackage = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		packageId: string(),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'delete',
			'/api/v2/admin/buy-option/{buyOptionId}/package/{packageId}',
			{
				path: {
					buyOptionId: input.buyOptionId,
					packageId: input.packageId
				},
				query: {
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 204) {
			const problem = (await response.json()) as Problem;
			console.error('Error deleting package:', problem);
			error(500, problem.detail || 'The package could not be deleted');
		}
	}
);
export const moveBuyOptionPackage = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		packageId: string(),
		direction: union([literal('up'), literal('down')]),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/buy-option/{buyOptionId}/package/{packageId}/move',
			{
				path: {
					buyOptionId: input.buyOptionId,
					packageId: input.packageId
				},
				body: {
					direction: input.direction,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 200) {
			const problem = (await response.json()) as Problem;
			console.error('Error moving package:', problem);
			error(500, problem.detail || 'The package could not be moved');
		}
	}
);

export const createBuyOptionBenefit = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		packageId: string(),
		serviceId: string(),
		booleanValue: optional(boolean()),
		stringValue: optional(string()),
		numericValue: optional(number()),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'post',
			'/api/v2/admin/buy-option/{buyOptionId}/benefit',
			{
				path: {
					buyOptionId: input.buyOptionId
				},
				body: {
					serviceId: input.serviceId,
					booleanValue: input.booleanValue,
					stringValue: input.stringValue,
					numericValue: input.numericValue,
					packageId: input.packageId,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 201) {
			const problem = (await response.json()) as Problem;
			console.error('Error creating benefit:', problem);
			error(500, problem.detail || 'The benefit could not be created');
		}
		const result = (await response.json()) as CreateBenefitOutput;
		return { id: result.id };
	}
);

export const updateBuyOptionBenefit = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		benefitId: string(),
		booleanValue: optional(boolean()),
		stringValue: optional(string()),
		numericValue: optional(number()),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'put',
			'/api/v2/admin/buy-option/{buyOptionId}/benefit/{benefitId}',
			{
				path: {
					buyOptionId: input.buyOptionId,
					benefitId: input.benefitId
				},
				body: {
					booleanValue: input.booleanValue,
					stringValue: input.stringValue,
					numericValue: input.numericValue,
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (!response.ok) {
			const problem = (await response.json()) as Problem;
			console.error('Error updating benefit:', problem);
			error(500, problem.detail || 'The benefit could not be updated');
		}
		const result = (await response.json()) as UpdatePackageOutput;
		return { id: result.id };
	}
);

export const deleteBuyOptionBenefit = command(
	object({
		eventId: string(),
		buyOptionId: string(),
		packageId: string(),
		benefitId: string(),
		version: number()
	}),
	async (input) => {
		const ctx = await createAdminContext();
		const response = await ctx.adminApi.request(
			'delete',
			'/api/v2/admin/buy-option/{buyOptionId}/benefit/{benefitId}',
			{
				path: {
					buyOptionId: input.buyOptionId,
					benefitId: input.benefitId
				},
				query: {
					version: input.version
				}
			}
		);
		if (response.status === 303) {
			redirect(303, `/admin/event/${input.eventId}/buy-options/${input.buyOptionId}`);
		}
		if (response.status !== 204) {
			const problem = (await response.json()) as Problem;
			console.error('Error deleting benefit:', problem);
			error(500, problem.detail || 'The benefit could not be deleted');
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
