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
	import { getEventDetails, publishEvent } from '@/remote/functions/admin/index.js';
	import Skeleton from '@/components/ui/skeleton/skeleton.svelte';

	let { data, children } = $props();

	function getTabs(event: { id?: string | undefined }) {
		const eventId = event.id;
		if (eventId === undefined) {
			return [];
		}
		return [
			{ href: `/admin/events/${eventId}/registrations`, name: 'registrations' },
			{ name: 'buy-options', href: `/admin/events/${eventId}/buy-options` },
			{ name: 'exports', href: `/admin/events/${eventId}/exports` }
		];
	}

	let eventFilter = $derived({
		eventId: page.params.id!
	});

	let getEventDetailsQuery = $derived(getEventDetails(eventFilter));

	let pending = $state(false);
</script>

<div>
	<div class="flex justify-between items-start">
		<button
			onclick={() => goto('/admin/events')}
			class="size-10 flex shrink justify-center rounded-lg items-center border text-stone-400 border-stone-200 mr-6"
		>
			<ReturnIcon />
		</button>
		<Event loading={getEventDetailsQuery.loading} event={getEventDetailsQuery.current} />
		<div class="grow"></div>
		{#if getEventDetailsQuery.current?.status === 'UNPUBLISHED'}
			<Button
				class={cn(pending && 'animate-pulse')}
				disabled={pending}
				onclick={async () => {
					try {
						pending = true;
						await publishEvent(eventFilter);
						toast.success('Event published successfully');
					} catch (error: unknown) {
						toast.error(error.body.message);
						throw error;
					} finally {
						pending = false;
					}
				}}>{$_('common.publish')}</Button
			>
		{/if}
	</div>

	{#if getEventDetailsQuery.loading}
		<Skeleton class=" bg-gray-400 h-10 w-[40ch] mt-12 mb-2" />
	{:else if getEventDetailsQuery.ready && getEventDetailsQuery.current}
		<div class="mt-12">
			<Tabs.Root
				value={getTabs(getEventDetailsQuery.current!).filter((tab) =>
					location.pathname.startsWith(tab.href)
				)[0]?.href}
			>
				<Tabs.List class="bg-neutral-200">
					{#each getTabs(getEventDetailsQuery.current!) as tab}
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
