<script lang="ts">
	import { goto } from '$app/navigation';
	import { ReturnIcon } from '@/@svelte/icons';
	import { LinkTabs, Spinner } from '@/@svelte/components';
	import type { LayoutServerData } from './$types';
	import { page, navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { Event } from '@/@svelte/components';
	import { Button } from '@/components/ui/button';

	$: activeUrl = $page.url.pathname;

	$: activeTab = activeUrl?.includes('/details') ? 2 : activeUrl?.includes('/buy-options') ? 1 : 0;
	export let data: LayoutServerData;
	$: tabs = [
		{ href: `/admin/events/${data.event?.id}/registrations`, name: 'registrations' },
		{ name: 'buy-options', href: `/admin/events/${data.event?.id}/buy-options` }
		// { name: 'details', href: `/admin/events/${data.event?.id}/details` }
	];

	function getEventInfo(url?: URL) {
		const match = url?.pathname.match(/\/events\/([^/]+)\/([^/]+)/);
		return match ? { eventId: match[1], page: match[2] } : null;
	}
</script>

<div>
	<div class="flex justify-between items-start">
		<button
			on:click={() => goto('/admin/events')}
			class="h-10 w-10 flex flex-shrink justify-center rounded-lg items-center border text-stone-400 border-stone-200 mr-6"
		>
			<ReturnIcon />
		</button>
		<Event event={data.event} />
		<div class="flex-grow"></div>
		{#if data.event?.status === "UNPUBLISHED"}
			<form action={`/admin/events/${$page.params.id}/?/publishEvent`} method="POST">
				<Button type="submit">Publish</Button>
			</form>
		{/if}
	</div>

	<div class="mt-12">
		<LinkTabs {tabs} {activeTab} />
	</div>
	{#if $navigating }
		{@const fromInfo = getEventInfo($navigating?.from?.url)}
		{@const toInfo = getEventInfo($navigating?.to?.url)}
		{#if fromInfo && toInfo && fromInfo.eventId === toInfo.eventId && fromInfo.page !== toInfo.page}
			<div class="grid justify-center items-center h-full text-orange-400">
				<Spinner color="red" />
			</div>
		{:else}
			<div in:fade>
				<slot />
			</div>
		{/if}
	{:else}
		<div in:fade>
			<slot />
		</div>
	{/if}
</div>