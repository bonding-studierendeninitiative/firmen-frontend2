<script lang="ts">
	import { goto } from '$app/navigation';
	import { CalenderIcon, LocationIcon, ReturnIcon } from '@/@svelte/icons';
	import { LinkTabs, Spinner } from '@/@svelte/components';
	import type { LayoutServerData } from './$types';
	import { page, navigating } from '$app/stores';
	import { fade } from 'svelte/transition';

	$: activeUrl = $page.url.pathname;

	$: activeTab = activeUrl?.includes('/buy-options') ? 1 : 0;
	export let data: LayoutServerData;
	$: tabs = [{
		href: `/admin/events/${data.event?.id}/registrations`,
		name: 'registrations'
	}, { name: 'buy-options', href: `/admin/events/${data.event?.id}/buy-options` }];

	function getEventInfo(url?: URL) {
		const match = url?.pathname.match(/\/events\/([^/]+)\/([^/]+)/);
		return match ? { eventId: match[1], page: match[2] } : null;
	}
</script>

<div>
	<div class=" flex justify-between items-start">
		<div class=" flex">
			<button
				on:click={() => goto('/admin/events')}
				class="  h-10 w-10 flex flex-shrink justify-center rounded-lg items-center border text-stone-400 border-stone-200 mr-6"
			>
				<ReturnIcon />
			</button
			>
			<div>
				<h4 class=" text-xl font-extrabold text-stone-800">{data.event?.name}</h4>
				<div class=" flex mt-2">
					<div class=" flex items-center mr-2">
						<CalenderIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{data.event?.dateFrom}</p>
					</div>
					<div class=" flex items-center">
						<LocationIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{data.event?.location}</p>
					</div>
				</div>
			</div>
		</div>
	</div>

	<div class=" mt-12">
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