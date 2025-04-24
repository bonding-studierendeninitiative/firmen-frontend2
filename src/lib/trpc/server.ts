import type { Context } from '$lib/trpc/context';
import { initTRPC, TRPCError } from '@trpc/server';
import { PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { clerkClient } from 'svelte-clerk/server';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const authorizedProcedure = publicProcedure.use(async ({ ctx, next }) => {
	if (!ctx.session?.sessionId) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
	}
	return next({
		ctx: {
			session: ctx.session,
			token: await clerkClient.sessions.getToken(ctx.session.sessionId, 'access_token')
		}
	});
});

export const authorizedOrgMemberProcedure = authorizedProcedure.use(async ({ ctx, next }) => {
	if (ctx.session?.orgId == null || ctx.session?.orgId == undefined) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not part of an organization!' });
	}
	return next({
		ctx: {
			session: ctx.session
		}
	});
});

export const adminProcedure = authorizedOrgMemberProcedure.use(({ ctx, next }) => {
	if (ctx.session?.orgId !== PUBLIC_BONDING_ORG_ID) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not an admin!' });
	}
	return next({
		ctx: {
			session: ctx.session
		}
	});
});

export const createCallerFactory = t.createCallerFactory;
