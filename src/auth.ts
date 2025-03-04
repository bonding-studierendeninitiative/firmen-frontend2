import type { Handle } from '@sveltejs/kit';
import { withClerkHandler } from 'svelte-clerk/server';

export const handle = withClerkHandler() satisfies Handle;
