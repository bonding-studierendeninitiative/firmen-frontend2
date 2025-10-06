import { createContext, type Context } from '$lib/trpc/context';
import { initTRPC, TRPCError } from '@trpc/server';
import { PUBLIC_BACKEND_HOST, PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { createApiClient as createAdminApiClient } from '@api/admin-client';
import { createApiClient } from '@api/client';
import { apiFetcher } from '@api';
import { auth } from '@/auth';
import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;

export const authorizedProcedure = publicProcedure.use(async ({ ctx, next }) => {
	if (!ctx.session?.id) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Invalid session!' });
	}

	try {
		const token = await ctx.auth.getToken({
			headers: {
				Authorization: `Bearer ${ctx.session.token}`
			}
		});
		const tokenized_ctx = {
			session: ctx.session,
			token: {
				jwt: token.token
			}
		};
		const api = createApiClient(apiFetcher(tokenized_ctx), PUBLIC_BACKEND_HOST);
		return next({
			ctx: {
				...tokenized_ctx,
				api
			}
		});
	} catch (error) {
		console.error('Error fetching token:', error);
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'Failed to authenticate!' });
	}
});

export const authorizedOrgMemberProcedure = authorizedProcedure.use(async ({ ctx, next }) => {
	if (ctx.session?.activeOrganizationId == null || ctx.session?.activeOrganizationId == undefined) {
		throw new TRPCError({ code: 'UNAUTHORIZED', message: 'You are not part of an organization!' });
	}
	return next({
		ctx: {
			...ctx,
			session: {
				...ctx.session,
				activeOrganizationId: ctx.session.activeOrganizationId
			}
		}
	});
});

export async function createAdminContext() {
	const ctx = await createContext(getRequestEvent());
	if (!ctx.session?.id) {
		error(401, 'Unauthorized');
	}
	if (ctx.session.activeOrganizationId !== PUBLIC_BONDING_ORG_ID) {
		const checkPermission = await ctx.auth.userHasPermission({
			body: {
				role: 'admin',
				userId: ctx.session.userId,
				permission: {
					user: ['create']
				}
			},
			headers: {
				Authorization: `Bearer ${ctx.session.token}`
			}
		});

		if (checkPermission.error || checkPermission.success === false) {
			console.log(`Can't access admin as regular user ${JSON.stringify(ctx.session.userId)}`);
			error(
				401, // Unauthorized
				{
					message: 'You do not have permission to access this resource.'
				}
			);
		}
	}
	const token = await ctx.auth.getToken({
		headers: {
			Authorization: `Bearer ${ctx.session?.token}`
		}
	});
	const tokenized_ctx = {
		session: ctx.session,
		token: {
			jwt: token.token
		}
	};
	return {
		...ctx,
		adminApi: createAdminApiClient(apiFetcher(tokenized_ctx), PUBLIC_BACKEND_HOST),
		api: createApiClient(apiFetcher(tokenized_ctx), PUBLIC_BACKEND_HOST)
	};
}

export const createCallerFactory = t.createCallerFactory;
