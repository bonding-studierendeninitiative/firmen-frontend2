import type { Context } from '$lib/trpc/context';
import { initTRPC, TRPCError } from '@trpc/server';
import { PUBLIC_BACKEND_HOST, PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { clerkClient } from 'svelte-clerk/server';
import { createApiClient as createAdminApiClient } from '@api/admin-client';
import { createApiClient } from '@api/client';
import { apiFetcher } from '@api';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const authorizedProcedure = publicProcedure.use(async ({ ctx, next }) => {
	if (!ctx.session?.sessionId) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
	}
	const tokenized_ctx = { session: ctx.session, token: await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token') }
	return next({
		ctx: {
			...tokenized_ctx,
			api: createApiClient(apiFetcher(tokenized_ctx), PUBLIC_BACKEND_HOST)
		}
	});
});

export const authorizedOrgMemberProcedure = authorizedProcedure.use(async ({ ctx, next }) => {
	if (ctx.session?.orgId == null || ctx.session?.orgId == undefined) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not part of an organization!' });
	}
	return next({
		ctx: {
			...ctx,
			session: {
				...ctx.session,
				orgId: ctx.session.orgId
			}
		}
	});
});

export const adminProcedure = authorizedOrgMemberProcedure.use(({ ctx, next }) => {
	if (ctx.session?.orgId !== PUBLIC_BONDING_ORG_ID) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not an admin!' });
	}
	const adminApi = createAdminApiClient(apiFetcher(ctx), PUBLIC_BACKEND_HOST);
	return next({
		ctx: {
			...ctx,
			adminApi
		}
	});
});

export const createCallerFactory = t.createCallerFactory;

