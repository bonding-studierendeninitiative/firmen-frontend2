import { authorizedOrgMemberProcedure, router } from '@/trpc/server';
import { object, parse, string, nullish, safeParse } from 'valibot';
import { AllEventsOutput, GetEventBuyOptionOutput, GetEventRegistrationForOrganizationOutput } from '@api/client';

export const eventRouter = router({
	unregisteredEvents: authorizedOrgMemberProcedure
		.input((input) =>
			parse(
				object({
					cursor: string(),
					limit: string()
				}),
				input
			)
		)
		.output(output => parse(AllEventsOutput, output))
		.query(async ({ ctx, input }) => {
			const response = await ctx.api.get("/api/v2/event/unregistered", {
				query: {
					organizationId: ctx.session.orgId,
					size: Number(input.limit),
					page: Number(input.cursor)
				},
			});
			return response
		}),
	getPublished: authorizedOrgMemberProcedure
		.input((input) => parse(
			object({
				page: nullish(string(), "0"),
				limit: nullish(string(), "4")
			}),
			input
		))
		.output((output) => parse(AllEventsOutput, output))
		.query(async ({ ctx, input }) => {
			try {
				const response = await ctx.api.get("/api/v2/event/published", {
					query: {
						page: Number(input.page),
						size: Number(input.limit)
					}
				});
				return response;
			} catch (error) {
				console.error(error);
				return {
					events: [],
					totalElements: 0,
					totalPages: 0,
					pageNumber: 0,
					pageSize: 10
				};
			}
		}),
	getDetails: authorizedOrgMemberProcedure
		.input((input) => {
			return parse(string(), input);
		})
		.query(async ({ ctx, input: eventId }) => {
			const response = await ctx.api.get("/api/v2/event/{eventId}", {
				path: { eventId }
			});
			return response;
		}),
	getActiveBuyOption: authorizedOrgMemberProcedure
		.input((input) => parse(string(), input))
		.output((output) => parse(GetEventBuyOptionOutput, output))
		.query(async ({ ctx, input: eventId }) => {
			const response = await ctx.api.request("get", "/api/v2/event/{eventId}/active-buy-option", {
				path: { eventId }
			});

			if (response.status === 404) {
				return null;
			}

			return await response.json();
		}),
	isOrgRegistered: authorizedOrgMemberProcedure
		.input((input) => parse(string(), input))
		.output((output) => {
			const result = safeParse(GetEventRegistrationForOrganizationOutput, output);
			if (!result.success) {
				console.error(result.issues)
				return null;
			}
			return result.output;
		})
		.query(async ({ ctx, input: eventId }) => {
			const response = await ctx.api.get("/api/v2/event/{eventId}/is-registered", {
				path: { eventId },
				query: {
					organizationId: ctx.session.orgId
				}
			});

			return response;
		})
});
