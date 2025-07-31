<script lang="ts">
	import { page } from '$app/state';
	import { goto, invalidate } from '$app/navigation';
	import { DeleteBuyOption, BuyOptionSelector, CreateBuyOption } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { trpc } from '@/trpc/client.js';
	import type { SimpleBuyOptionResponse } from '@api/admin-client.js';

	let { data, children } = $props();

	function mapBuyOptionToValue(buyOption: SimpleBuyOptionResponse) {
		return {
			value: buyOption.id ?? '',
			name: buyOption.name ?? '',
			label: buyOption.name ?? $_('modules.buy-option-selector.unnamed'),
			active: !!buyOption.active
		};
	}

	let isDialogOpen = writable(false);
	setContext('isCreateBuyOptionDialogOpen', isDialogOpen);

	const api = trpc(page);

	const [buyOptionsQuery, resolveBuyOptions] = api.admin.events.buyOptions.getAll.createQuery(
		{
			eventId: page.params.id,
			page: '0',
			limit: '10',
			sortBy: 'creationDate',
			sortDirection: 'desc'
		},
		{
			lazy: true
		}
	);

	const activateBuyOption = api.admin.events.buyOptions.activate.createMutation();
</script>

{#await resolveBuyOptions(data?.buyOptionData)}
	<LoaderCircle class="animate-spin size-14 mx-auto" />
{:then _ignored}
	{@const buyOptions = $buyOptionsQuery.data?.buyOptions ?? []}
	{@const activeBuyOption = buyOptions.find((buyOption) => buyOption.active)}
	{#if $buyOptionsQuery.isError}
		<p class="text-red-500">Error: {$buyOptionsQuery.error.message}</p>
	{/if}

	{#if $buyOptionsQuery.isLoading}
		<LoaderCircle class="animate-spin size-14 mx-auto" />
	{/if}
	<section in:fade class="mt-10 flex flex-col gap-y-8">
		<nav class="flex justify-between gap-x-2">
			<BuyOptionSelector
				buyOptions={buyOptions.map(mapBuyOptionToValue) ?? []}
				value={page.params.buyOptionId}
				onSelect={async (value) => {
					await goto(`/admin/events/${page.params.id}/buy-options/${value}`);
					await invalidate('buyOption');
				}}
			/>
			<DeleteBuyOption />
			<div class="grow"></div>
			<Button
				onclick={() => {
					$activateBuyOption.mutate({
						buyOptionId: page.params.buyOptionId,
						eventId: page.params.eventId
					});
				}}
				disabled={!page.params.buyOptionId || page.params.buyOptionId === activeBuyOption?.id}
				>{$_('admin-pages.events.buy-options.publish')}</Button
			>
		</nav>
		{@render children?.()}
	</section>
{:catch error}
	<p class="text-red-500">Error: {error.message}</p>
{/await}

<CreateBuyOption bind:isDialogOpen={$isDialogOpen} />
