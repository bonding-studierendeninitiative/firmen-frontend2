import { writable, type Writable } from 'svelte/store';

export const buyOptionFormTouched: Writable<boolean> = writable(false);
