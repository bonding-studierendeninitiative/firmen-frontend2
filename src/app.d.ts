// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: import('@prisma-app/auth-client').Session | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
	declare module '*.svelte' {
		import type { ComponentType } from 'svelte';
		const component: ComponentType;
		export default component;
	}
}

export {};
