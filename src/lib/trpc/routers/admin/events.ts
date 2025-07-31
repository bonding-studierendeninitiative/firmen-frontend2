import { adminProcedure, router } from '@/trpc/server';
import { object, parse, string, nullish, array, literal, optional, number, union } from 'valibot';
import { AddAddonPackageInput, Problem } from '@api/admin-client';
import { TRPCError } from '@trpc/server';
import { clerkClient } from 'svelte-clerk/server';
import { buyOptionsRouter } from './buyOptions';

const addonPackagesRouter = router({
	getAll: adminProcedure
		.input((input) =>
			parse(
				object({
					eventId: string(),
					buyOptionId: string(),
					page: nullish(string(), '0'),
					limit: nullish(string(), '6')
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			const response = await ctx.adminApi.get(
				'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package',
				{
					path: {
						eventId: input.eventId,
						buyOptionId: input.buyOptionId
					},
					query: {
						page: Number(input.page),
						limit: Number(input.limit)
					}
				}
			);
			return response;
		}),
	getOne: adminProcedure
		.input((input) =>
			parse(
				object({
					addonPackageId: string(),
					eventId: string(),
					buyOptionId: string()
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			const response = await ctx.adminApi.get(
				'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}',
				{
					path: input,
					query: { includeAddons: true }
				}
			);
			return response;
		}),
	create: adminProcedure
		.input((input) =>
			parse(
				object({
					eventId: string(),
					buyOptionId: string(),
					data: AddAddonPackageInput
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.adminApi.post(
				'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package',
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
					buyOptionId: string(),
					addonPackageId: string()
				}),
				input
			)
		)
		.mutation(async ({ ctx, input }) => {
			const response = await ctx.adminApi.request(
				'delete',
				'/api/v2/admin/event/{eventId}/buy-option/{buyOptionId}/addon-package/{addonPackageId}',
				{
					path: {
						eventId: input.eventId,
						buyOptionId: input.buyOptionId,
						addonPackageId: input.addonPackageId
					}
				}
			);

			if (response.status !== 204) {
				throw new TRPCError({
					code: 'NOT_FOUND',
					message: 'Addon package not found'
				});
			}
		})
});

export const adminEventsRouter = router({
	publish: adminProcedure
		.input((input) => {
			return parse(
				object({
					eventId: string()
				}),
				input
			);
		})
		.mutation(async ({ ctx, input: { eventId } }) => {
			const response = await ctx.adminApi.request('post', '/api/v2/admin/event/{eventId}/publish', {
				path: { eventId }
			});

			if (response.status !== 204) {
				const problem = (await response.json()) as Problem;
				throw new TRPCError({
					code: 'INTERNAL_SERVER_ERROR',
					message: problem.detail
				});
			}
		}),
	getEventRegistrations: adminProcedure
		.input((input) =>
			parse(
				object({
					eventId: string(),
					cursor: nullish(number(), 0),
					limit: nullish(number(), 10)
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			const response = await ctx.adminApi.get('/api/v2/admin/event/{eventId}/event_registrations', {
				path: {
					eventId: input.eventId
				},
				query: {
					page: input.cursor,
					size: input.limit
				}
			});
			const { eventRegistrations, totalPages, totalElements, pageNumber, pageSize } = response;
			return {
				eventRegistrations: await Promise.all(
					(eventRegistrations ?? [])
						.filter((eventRegistration) => eventRegistration.organizationId != undefined)
						.map(async (eventRegistration) => {
							const org = await clerkClient.organizations.getOrganization({
								organizationId: eventRegistration.organizationId as string
							});

							return {
								...eventRegistration,
								organization: {
									name: org.name,
									address: 'no address found',
									logo: org.imageUrl
								}
							};
						})
				),
				totalElements,
				totalPages,
				pageNumber,
				pageSize
			};
		}),
	getAll: adminProcedure
		.input((input) =>
			parse(
				object({
					sortDirection: optional(string()),
					sortBy: optional(string()),
					page: optional(number(), 0),
					size: optional(number(), 10),
					event_status: optional(
						array(union([literal('UNPUBLISHED'), literal('PUBLISHED'), literal('ARCHIVED')]))
					)
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			const response = await ctx.adminApi.get('/api/v2/admin/event', {
				query: {
					event_status: input.event_status,
					size: input.size,
					page: input.page
				}
			});
			return response;
		}),
	buyOptions: buyOptionsRouter,
	addonPackages: addonPackagesRouter
});
