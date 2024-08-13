<script lang="ts">
	import { goto } from '$app/navigation';
	import { CalenderIcon, LocationIcon, ReturnIcon } from '@/@svelte/icons';
	import { LinkTabs } from '@/@svelte/components';
	import type { LayoutServerData } from './$types';
	import { page } from '$app/stores';

	$: activeUrl = $page.url.pathname;

	$: activeTab = activeUrl?.includes('/buy-options') ? 1 : 0;
	export let data: LayoutServerData;
	$: tabs = [{
		href: `/admin/events/${data.event?.id}/registrations`,
		name: 'registrations'
	}, { name: 'buy-options', href: `/admin/events/${data.event?.id}/buy-options` }];
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
					<span class=" flex items-center mr-2">
						<!-- svelte-ignore missing-declaration -->
						<CalenderIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{data.event?.dateFrom}</p>
					</span>
					<span class=" flex items-center">
						<LocationIcon />
						<p class=" ml-2 text-sm text-stone-800 font-medium">{data.event?.location}</p>
					</span>
				</div>
			</div>
		</div>
	</div>

	<div class=" mt-12">
		<LinkTabs {tabs} {activeTab} />
	</div>

	<slot />
</div>