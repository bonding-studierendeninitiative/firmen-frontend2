// src/+layout.server.ts
import { type AuthObject, buildClerkProps } from 'svelte-clerk/server';

// To enable Clerk SSR support, add initial state props to the load function
export const load = async ({ locals }) => {
	return {
		...buildClerkProps(locals.auth as unknown as AuthObject)
	};
};
