import type { Router } from '@/trpc/router';
import { createTRPCClient, type TRPCClientInit } from 'trpc-sveltekit';
import { svelteQueryWrapper } from 'trpc-svelte-query-adapter';
import type { QueryClient } from '@tanstack/svelte-query';
import type { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

let browserClient: ReturnType<typeof svelteQueryWrapper<Router>>;

type RouterOutput = inferRouterOutputs<Router>;
type RouterInput = inferRouterInputs<Router>;

export type AdminOrgsOutput = RouterOutput['admin']['orgs']['list'];
export type AdminUsersOutput = RouterOutput['admin']['users']['getAll'];
export type AdminUserOrgsOutput = RouterOutput['admin']['users']['getOrgMemberships'];
export type EventRegistrationsForEventOutput =
	RouterOutput['admin']['events']['getEventRegistrations'];
export type EventRegistrationsForOrganizationOutput =
	RouterOutput['eventRegistrations']['forOrganization'];
export type UnregisteredEventsOutput = RouterOutput['events']['unregisteredEvents'];

export function trpc(init?: TRPCClientInit, queryClient?: QueryClient) {
	const isBrowser = typeof window !== 'undefined';
	if (isBrowser && browserClient) return browserClient;
	const client = svelteQueryWrapper<Router>({
		client: createTRPCClient<Router>({ init }),
		queryClient
	});
	if (isBrowser) browserClient = client;
	return client;
}
