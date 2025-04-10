import { publicProcedure, router } from '@/trpc/server';
import { literal, object, optional, parse, string, union } from 'valibot';
import { JobsSchema } from '@schema';
import { clerkClient } from 'svelte-clerk/server';
import { getActiveBuyOption, getJobs, publishEvent } from '@/services';
import { API } from '@api';
import { TRPCError } from '@trpc/server';
import { adminEventRegistrationsRouter } from '@/trpc/routers/admin/eventRegistrations';
import { adminCatalogueDataRouter } from '@/trpc/routers/admin/catalogueData';

export const adminRouter = router({
	events: router({
		publish: publicProcedure
			.input((input) => {
				return parse(
					object({
						eventId: string()
					}),
					input
				);
			})
			.mutation(async ({ ctx, input: { eventId } }) => {
				if (!ctx.session.sessionId)
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
				const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');
				const buyOption = await getActiveBuyOption({
					accessToken: token.jwt,
					eventId
				});

				if (buyOption === null) {
					throw new TRPCError({
						code: 'PRECONDITION_FAILED',
						message: 'No active buy option found'
					});
				}

				await publishEvent({
					accessToken: token.jwt,
					eventId
				});
			})
	}),
	export: router({
		getAll: publicProcedure.query(() => {}),
		generateDownloadLink: publicProcedure
			.input((input) =>
				parse(
					object({
						exportId: string(),
						eventId: string()
					}),
					input
				)
			)
			.output((output) => parse(string(), output))
			.mutation(async ({ ctx, input }) => {
				if (ctx.session.sessionId === null)
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
				const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');
				const response = await API.get<string>({
					route: `/admin/events/${input.eventId}/exports/${input.exportId}/download`,
					token: token.jwt
				});
				return await response.text();
			})
	}),
	eventRegistrations: adminEventRegistrationsRouter,
	catalogueData: adminCatalogueDataRouter,
	jobs: publicProcedure
		.input((input) => {
			console.log(input);
			return parse(
				object(
					{
						stateName: union([
							literal('SUCCEEDED'),
							literal('FAILED'),
							literal('PROCESSING'),
							literal('ENQUEUED'),
							literal('SCHEDULED'),
							literal('DELETED')
						]),
						limit: string(),
						offset: string()
					},
					'Invalid input'
				),
				input
			);
		})
		.output((output) => {
			const result = parse(JobsSchema, output);
			console.log('Jobs result:', result);
			return result;
		})
		.query(async ({ ctx, input }) => {
			if (ctx.session.sessionId === null)
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
			const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');
			return await getJobs({
				accessToken: token.jwt,
				stateName: input.stateName,
				limit: input.limit,
				offset: input.offset
			});
		}),
	orgMembers: publicProcedure
		.input((input) =>
			parse(
				object({
					organizationId: string()
				}),
				input
			)
		)
		.query(async ({ ctx, input }) => {
			if (ctx.session.sessionId === null)
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
			const organizationMembers = await clerkClient.organizations.getOrganizationMembershipList({
				organizationId: input.organizationId
			});
			return organizationMembers.data;
		}),
	orgs: publicProcedure
		.input((input) => parse(optional(string(), ''), input))
		.query(async ({ ctx, input }) => {
			if (ctx.session.sessionId === null)
				throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
			const organizations = await clerkClient.organizations.getOrganizationList({
				query: input || undefined
			});
			return organizations.data;
		})
});
