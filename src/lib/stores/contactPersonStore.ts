import { type Writable, writable } from 'svelte/store';
import type { ContactPersonDetails } from '$lib/schemas/contactPersonSchema';

export const contactPersonDetailsStore: Writable<undefined | ContactPersonDetails> = writable(undefined);