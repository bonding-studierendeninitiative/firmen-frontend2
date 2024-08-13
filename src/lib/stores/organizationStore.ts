import { type Writable, writable } from 'svelte/store';
import type { OrgMembership } from '$lib/services/organizations';

export const currentOrganization: Writable<undefined | OrgMembership> = writable(undefined);