<script lang="ts">
	import * as Tabs from '@/components/ui/tabs';
	import { goto } from '$app/navigation';
	import { ReturnIcon } from '@/@svelte/icons';
	import { page } from '$app/state';
	import { Event } from '@/@svelte/components';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import { LoaderCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { cn } from '@/utils';
	import { getEventDetails, publishEvent } from '@/trpc/routers/admin';

	let { data, children } = $props();

	function getTabs(event: { id: string }) {
		return [
			{ href: `/admin/events/${event?.id}/registrations`, name: 'registrations' },
			{ name: 'buy-options', href: `/admin/events/${event?.id}/buy-options` },
			{ name: 'exports', href: `/admin/events/${event?.id}/exports` }
		];
	}

	let eventFilter = $derived({
		eventId: page.params.id!
	});
</script>

<div>
	<div class="flex justify-between items-start">
		<button
			onclick={() => goto('/admin/events')}
			class="size-10 flex shrink justify-center rounded-lg items-center border text-stone-400 border-stone-200 mr-6"
		>
			<ReturnIcon />
		</button>
		{#if getEventDetails(eventFilter).loading}
			<LoaderCircle class="size-10 mx-auto animate-spin" />
		{:else if getEventDetails(eventFilter).ready && getEventDetails(eventFilter).current}
			<Event event={getEventDetails(eventFilter).current} />
			<div class="grow"></div>
			{#if getEventDetails(eventFilter).current?.status === 'UNPUBLISHED'}
				<Button
					class={cn($effect.pending() && 'animate-pulse')}
					disabled={!!$effect.pending()}
					onclick={async () => {
						try {
							await publishEvent(eventFilter);
							toast.success('Event published successfully');
						} catch (error) {
							toast.error(error.message);
							throw error;
						}
					}}>{$_('common.publish')}</Button
				>
			{/if}
		{/if}
	</div>

	{#if getEventDetails(eventFilter).loading}
		<LoaderCircle class="size-10 mx-auto animate-spin" />
	{:else if getEventDetails(eventFilter).ready && getEventDetails(eventFilter).current}
		<div class="mt-12">
			<Tabs.Root
				value={getTabs(getEventDetails(eventFilter).current!).filter((tab) =>
					location.pathname.startsWith(tab.href)
				)[0]?.href}
			>
				<Tabs.List class="bg-neutral-200">
					{#each getTabs(getEventDetails(eventFilter).current!) as tab}
						<a href={tab.href}>
							<Tabs.Trigger value={tab.href}>{$_(`tab-headings.${tab.name}`)}</Tabs.Trigger>
						</a>
					{/each}
				</Tabs.List>
			</Tabs.Root>
		</div>
	{/if}

	{@render children?.()}
</div>
