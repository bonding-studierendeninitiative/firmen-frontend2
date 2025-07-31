import { adminProcedure, router } from '@/trpc/server';
import { CreateEventBuyOptionInput, UpdateEventBuyOptionInput } from '@api/admin-client';
import { CreateBuyOptionRequestSchema } from '@schema';
import { TRPCError } from '@trpc/server';
import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import { nullish, object, parse, string } from 'valibot';

export const buyOptionsRouter = router({
	getAll: adminProcedure
		.input((input) =>
			parse(
				object({
					eventId: string(),
					page: nullish(string(), '0'),
					limit: nullish(string(), '4'),
					sortBy: nullish(string(), 'creationDate'),
					sortDirection: nullish(string(), 'desc')
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			const response = await ctx.adminApi.get('/api/v2/admin/event/{eventId}/buy-option', {
				path: { eventId: input.eventId },
				query: {
					page: Number(input.page),
					size: Number(input.limit),
					sortBy: input.sortBy,
					sortDirection: input.sortDirection
				}
			});
			return response;
		}),
	getOne: adminProcedure
		.input((input) =>
			parse(
				object({
					eventId: string(),
					buyOptionId: string()
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
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
		}),
	createForm: adminProcedure.query(async () => {
		const createForm = await superValidate(valibot(CreateBuyOptionRequestSchema));

		return {
			createForm
		};
	}),
	create: adminProcedure
		.input((input) =>
			parse(
				object({
					eventId: string(),
					data: CreateEventBuyOptionInput
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.adminApi.post('/api/v2/admin/event/{eventId}/buy-option', {
				path: { eventId: input.eventId },
				body: input.data
			});
			return response;
		}),
	update: adminProcedure
		.input((input) =>
			parse(
				object({
					eventId: string(),
					buyOptionId: string(),
					data: UpdateEventBuyOptionInput
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.adminApi.put(
				'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}',
				{
					path: {
						eventId: input.eventId,
						buyOptionId: input.buyOptionId
					},
					body: input.data
				}
			);
			return response;
		}),
	delete: adminProcedure
		.input((input) =>
			parse(
				object({
					eventId: string(),
					buyOptionId: string()
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.adminApi.request(
				'delete',
				'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}',
				{
					path: {
						eventId: input.eventId,
						buyOptionId: input.buyOptionId
					}
				}
			);

			if (response.status !== 204) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Buy option not found'
				});
			}
		}),
	activate: adminProcedure
		.input((input) =>
			parse(
				object({
					buyOptionId: string(),
					eventId: string()
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.adminApi.request(
				'post',
				'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/activate',
				{
					path: {
						buyOptionId: input.buyOptionId,
						eventId: input.eventId
					}
				}
			);
			if (response.status === 404) {
				throw new TRPCError({ message: 'No active buy option found.', code: 'NOT_FOUND' });
			}
			if (response.status !== 204 && response.status !== 200) {
				throw new TRPCError({
					message: 'The buy option could not be activated.',
					code: 'BAD_REQUEST'
				});
			}
		})
});
