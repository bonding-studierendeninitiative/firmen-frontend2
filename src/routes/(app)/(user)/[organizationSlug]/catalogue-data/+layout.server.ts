import { PUBLIC_BACKEND_HOST } from '$env/static/public';
import { catalogueDataStore } from '@/stores/catalogueDataEvent.js';
import { clerkClient } from 'svelte-clerk/server';
import { writable } from 'svelte/store';
import { source, type SourceConfiguration } from 'sveltekit-sse';

export async function load({ parent }) {
	const { initialState } = await parent();
	if (!initialState.orgSlug || !initialState.sessionId) return;

	return {
		orgSlug: initialState.orgSlug
	};
}
