// lib/trpc/context.ts
import type { RequestEvent } from '@sveltejs/kit';
import { type AuthObject } from 'svelte-clerk/server';

export async function createContext({ locals }: RequestEvent) {
	return {
		session: locals.auth as unknown as AuthObject
	};
}

export type Context = Awaited<ReturnType<typeof createContext>>;
