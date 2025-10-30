<script lang="ts">
	import { _ } from '@services';
	import { EventsList } from '@/@svelte/modules';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { getPublished } from '@/remote/functions';

	let { params } = $props();

	let eventsQuery = getPublished({
		page: '0',
		limit: '20'
	});
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.events.events')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.events.eventsSubHeading')}</h4>
	{#if eventsQuery.loading}
		<LoaderCircle class="size-10 my-8 mx-auto animate-spin" />
	{:else if eventsQuery.error}
		<p>{eventsQuery.error.message}</p>
	{:else if eventsQuery.ready}
		<div in:fade>
			{#if eventsQuery.current?.data?.length === 0}
				<p class="container mt-8 flex justify-center items-center h-full">
					{$_('user-pages.events.noEvents')}
				</p>
			{/if}
			<EventsList events={eventsQuery.current?.data ?? []} orgSlug={params.organizationSlug} />
		</div>
	{/if}
</div>
