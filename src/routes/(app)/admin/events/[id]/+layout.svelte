<script lang="ts">
	import { goto } from '$app/navigation';
	import { ReturnIcon } from '@/@svelte/icons';
	import { LinkTabs } from '@/@svelte/components';
	import { page } from '$app/state';
	import { Event } from '@/@svelte/components';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import { LoaderCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { trpc } from '@/trpc/client';
	import { cn } from '@/utils';

	let { data, children } = $props();

	function getTabs(event: { id: string }) {
		return [
			{ href: `/admin/events/${event?.id}/registrations`, name: 'registrations' },
			{ name: 'buy-options', href: `/admin/events/${event?.id}/buy-options` },
			{ name: 'exports', href: `/admin/events/${event?.id}/exports` }
		];
	}

	const publishEvent = trpc(page).admin.events.publish.createMutation();
</script>

<div>
	<div class="flex justify-between items-start">
		<button
			onclick={() => goto('/admin/events')}
			class="size-10 flex shrink justify-center rounded-lg items-center border text-stone-400 border-stone-200 mr-6"
		>
			<ReturnIcon />
		</button>
		{#await data.event}
			<LoaderCircle class="size-10 mx-auto animate-spin" />
		{:then event}
			<Event {event} />
			<div class="grow"></div>
			{#if event?.status === 'UNPUBLISHED'}
				<Button class={cn($publishEvent.isPending && "animate-pulse")} disabled={$publishEvent.isPending} onclick={() => $publishEvent.mutate({
					eventId: event.id
					}, {
						onError: (error) => {
							toast.error(error.message);
						},
						onSuccess: () => {
							toast.success('Event published successfully');
						}
					})}>{$_("common.publish")}</Button>
			{/if}
		{:catch error}
			<div class="text-red-500">Error: {error.message}</div>
		{/await}
	</div>

	{#await data.event}
		<LoaderCircle class="size-10 mx-auto animate-spin" />
	{:then event}
		<div class="mt-12">
			<LinkTabs tabs={getTabs(event)} />
		</div>
	{:catch error}
		<div class="text-red-500">Error: {error.message}</div>
	{/await}

	{@render children?.()}
</div>
