// lib/trpc/context.ts
import { auth } from '@/auth';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma-app/client';
import { PUBLIC_BACKEND_HOST, PUBLIC_BONDING_ORG_ID } from '$env/static/public';
import { createApiClient as createAdminApiClient } from '@api/admin-client';
import { createApiClient } from '@api/client';
import { apiFetcher } from '@api';
import { getRequestEvent } from '$app/server';
import { error } from '@sveltejs/kit';

export async function createContext({ request }: RequestEvent) {
	const authApi = auth.api;
	const session = await authApi.getSession({
		headers: request.headers
	});
	// Log the session as json for debugging
	const db = new PrismaClient();
	return {
		...session,
		db,
		auth: authApi
	};
}

export async function createPublicContext({ request }: { request?: Request }) {
	const ctx = await createContext(request ? ({ request } as RequestEvent) : getRequestEvent());
	return {
		...ctx,
		api: createApiClient(apiFetcher({ ...ctx, token: undefined }), PUBLIC_BACKEND_HOST)
	};
}

export async function createAuthorizedContext() {
	const ctx = await createContext(getRequestEvent());
	if (!ctx.session || !ctx.session.id) {
		error(401, 'Invalid Session. You are not signed in!');
	}

	try {
		const token = await ctx.auth.getToken({
			headers: {
				Authorization: `Bearer ${ctx.session.token}`
			}
		});
		const tokenized_ctx = {
			...ctx,
			session: ctx.session,
			token: {
				jwt: token.token
			}
		};
		const api = createApiClient(apiFetcher(tokenized_ctx), PUBLIC_BACKEND_HOST);
		return {
			...tokenized_ctx,
			api
		};
	} catch (e) {
		console.error('Error fetching token:', e);
		error(401, 'Failed to authenticate!');
	}
}

export async function createOrgMemberContext() {
	const ctx = await createAuthorizedContext();
	if (ctx.session?.activeOrganizationId == null || ctx.session?.activeOrganizationId == undefined) {
		error(401, { message: 'You are not part of an organization!' });
	}
	return {
		...ctx,
		session: {
			...ctx.session,
			activeOrganizationId: ctx.session.activeOrganizationId
		}
	};
}

export async function createAdminContext() {
	const ctx = await createOrgMemberContext();
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
	return {
		...ctx,
		adminApi: createAdminApiClient(apiFetcher(ctx), PUBLIC_BACKEND_HOST)
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
