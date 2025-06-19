<script lang="ts">
	import { NoDataFound } from '@/@svelte/components';
	import { page } from '$app/state';
	import { goto, invalidate } from '$app/navigation';
	import { DeleteBuyOption, BuyOptionSelector, CreateBuyOption } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import type { InferOutput } from 'valibot';
	import { type GetBuyOptionsResponse } from '@schema';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import { trpc } from '@/trpc/client.js';

	let { data, children } = $props();

	function mapBuyOptionToValue(
		buyOption: InferOutput<GetBuyOptionsResponse>['buyOptions'][number]
	) {
		return {
			value: buyOption.id,
			name: buyOption.name,
			label: buyOption.name,
			active: buyOption.active
		};
	}

	let isDialogOpen = writable(false);
	setContext('isCreateBuyOptionDialogOpen', isDialogOpen);

	const api = trpc(page);

	const activateBuyOption = api.admin.events.buyOptions.activate.createMutation();
</script>

{#await data.buyOptionData}
	<LoaderCircle class="animate-spin size-14 mx-auto" />
{:then buyOptions}
	<section in:fade class="mt-10 flex flex-col gap-y-8">
		{#if (buyOptions?.totalElements ?? 0) > 0}
			{@const activeBuyOption = buyOptions?.buyOptions?.find((buyOption) => buyOption.active)}
			<nav class="flex justify-between gap-x-2">
				<BuyOptionSelector
					buyOptions={buyOptions?.buyOptions?.map(mapBuyOptionToValue) ?? []}
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
		{:else}
			<NoDataFound
				onButtonClick={() => ($isDialogOpen = true)}
				buttonText="Create a new buy option&hellip;"
				heading="This event does not have any buy options yet."
				subHeading="Create a buy option now to enable organizations to sign up to this event."
			/>
		{/if}
	</section>
{:catch error}
	<p class="text-red-500">Error: {error.message}</p>
{/await}
{#await data.createForm}
	<LoaderCircle class="animate-spin size-16" />
{:then createForm}
	<CreateBuyOption bind:isDialogOpen={$isDialogOpen} {createForm} />
{:catch error}
	<p class="text-red-500">Error: {error.message}</p>
{/await}
