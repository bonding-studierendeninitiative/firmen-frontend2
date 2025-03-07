<script lang="ts">
	import { _ } from '@services';
	import type { PageData } from './$types';
	import { EventsList } from '@/@svelte/modules';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let data: PageData;
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.events.events')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.events.eventsSubHeading')}</h4>
	{#await data.events}
		<LoaderCircle class="w-10 h-10 my-8 mx-auto animate-spin" />
	{:then events}
		<div in:fade>
		{#if events?.data.length === 0}
			<p class="container mt-8 flex justify-center items-center h-full">{$_('user-pages.events.noEvents')}</p>
		{/if}
		<EventsList events={events?.data ?? []} orgSlug={data.initialState.orgSlug} />
		</div>
	{:catch error}
		<p>{error.message}</p>
	{/await}
</div>
