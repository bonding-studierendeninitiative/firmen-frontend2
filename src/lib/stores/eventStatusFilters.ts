import { type Writable, writable } from 'svelte/store';

export type EventStatusFilter = 'published' | 'unpublished' | 'archived';

export const eventStatusFilters: Writable<EventStatusFilter[]> = writable([]);
