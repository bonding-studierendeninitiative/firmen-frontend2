import { publicProcedure, router } from '@/trpc/server';
import { nonEmpty, nullish, object, parse, pipe, string } from 'valibot';
import { clerkClient } from 'svelte-clerk/server';
import {
	deleteAdvertisement,
	deleteLogo,
	getOrgAdvertisements,
	getOrgLogos,
	pickAdvertisement,
	pickLogo
} from '@/services';
import { TRPCError } from '@trpc/server';
import { PickAdvertisementRequest, PickLogoRequest } from '@schema';

const GetCatalogDataSchema = object({
	limit: nullish(string(), '10'),
	cursor: nullish(string(), '0')
});

export const catalogueDataRouter = router({
	logos: router({
		getAll: publicProcedure
			.input((input) => parse(GetCatalogDataSchema, input))
			.query(async ({ ctx, input: { cursor: start = '0', limit = '10' } }) => {
				if (ctx.session.sessionId === null || ctx.session.orgId === null)
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
				const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');
				// Fetch organizations from Clerk
				return await getOrgLogos({
					accessToken: token.jwt,
					organizationId: ctx.session.orgId,
					page: start,
					limit
				});
			}),
		deleteLogo: publicProcedure
			.input((input) => parse(pipe(string(), nonEmpty()), input))
			.mutation(async ({ ctx, input }) => {
				if (!ctx.session.sessionId || !ctx.session.orgId) {
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
				}

				const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

				await deleteLogo({
					accessToken: token.jwt,
					data: {
						logoId: input,
						organizationId: ctx.session.orgId
					}
				});
			}),
		pick: publicProcedure
			.input((input) => parse(PickLogoRequest, input))
			.mutation(async ({ ctx, input }) => {
				if (!ctx.session.sessionId || !ctx.session.orgId) {
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
				}

				const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

				await pickLogo({
					accessToken: token.jwt,
					data: input
				});
			})
	}),
	advertisements: router({
		getAll: publicProcedure
			.input((input) => parse(GetCatalogDataSchema, input))
			.query(async ({ ctx, input }) => {
				if (ctx.session.sessionId === null || ctx.session.orgId === null)
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
				const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

				return await getOrgAdvertisements({
					accessToken: token.jwt,
					organizationId: ctx.session.orgId
				});
			}),
		deleteAdvertisement: publicProcedure
			.input((input) => parse(pipe(string(), nonEmpty()), input))
			.mutation(async ({ ctx, input }) => {
				if (!ctx.session.sessionId || !ctx.session.orgId) {
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
				}

				const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

				await deleteAdvertisement({
					accessToken: token.jwt,
					data: {
						advertisementId: input,
						organizationId: ctx.session.orgId
					}
				});
			}),
		pick: publicProcedure
			.input((input) => parse(PickAdvertisementRequest, input))
			.mutation(async ({ ctx, input }) => {
				if (!ctx.session.sessionId || !ctx.session.orgId) {
					throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
				}

				const token = await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token');

				await pickAdvertisement({
					accessToken: token.jwt,
					data: input
				});
			})
	})
});
