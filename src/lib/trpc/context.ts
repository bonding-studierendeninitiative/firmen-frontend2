// lib/trpc/context.ts
import { auth } from '@/auth';
import type { RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma-app/client';

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

export type Context = Awaited<ReturnType<typeof createContext>>;
