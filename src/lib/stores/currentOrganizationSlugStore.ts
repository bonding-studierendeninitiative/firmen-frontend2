import { type Writable, writable } from 'svelte/store';

export const currentOrganizationSlugStore: Writable<undefined | string> = writable(undefined);