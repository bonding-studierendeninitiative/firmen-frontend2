// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
/// <reference types="svelte-clerk/env" />
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			auth: AuthObject;
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
