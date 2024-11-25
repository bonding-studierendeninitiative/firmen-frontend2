import { type Writable, writable } from 'svelte/store';

export const selectedOrganization: Writable<undefined | string> = writable(undefined);
