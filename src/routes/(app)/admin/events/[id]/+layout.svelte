<script lang="ts">
	import { goto } from '$app/navigation';
	import { ReturnIcon } from '@/@svelte/icons';
	import { LinkTabs, Spinner } from '@/@svelte/components';
	import { page, navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
	import { Event } from '@/@svelte/components';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import { LoaderCircle } from 'lucide-svelte';

	export let data;
	function getTabs(event: { id: string }) {
		return [
			{ href: `/admin/events/${event?.id}/registrations`, name: 'registrations' },
			{ name: 'buy-options', href: `/admin/events/${event?.id}/buy-options` }
			// { name: 'details', href: `/admin/events/${data.event?.id}/details` }
		]
	}

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
		{#await data.event}
			<LoaderCircle class="h-10 w-10 mx-auto animate-spin" />
		{:then event}
			<Event {event} />
			<div class="flex-grow"></div>
			{#if event?.status === 'UNPUBLISHED'}
				<form action={`/admin/events/${$page.params.id}/?/publishEvent`} method="POST">
					<Button type="submit">{$_("common.publish")}</Button>
				</form>
			{/if}
		{:catch error}
			<div class="text-red-500">Error: {error.message}</div>
		{/await}
	</div>

	{#await data.event}
		<LoaderCircle class="h-10 w-10 mx-auto animate-spin" />
	{:then event}
		<div class="mt-12">
			<LinkTabs tabs={getTabs(event)} />
		</div>
	{:catch error}
		<div class="text-red-500">Error: {error.message}</div>
	{/await}

	<slot />
</div>
