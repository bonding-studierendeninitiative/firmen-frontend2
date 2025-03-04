<script lang="ts">
	import { NoDataFound } from '@/@svelte/components';
	import { page } from '$app/stores';
	import { goto, invalidate } from '$app/navigation';
	import { DeleteBuyOption, BuyOptionSelector, CreateBuyOption } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import type { InferOutput } from 'valibot';
	import { type GetBuyOptionsResponse } from '@schema';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let data;

	function mapBuyOptionToValue(buyOption: InferOutput<GetBuyOptionsResponse>['buyOptions'][number]) {
		return {
			value: buyOption.id,
			name: buyOption.name,
			label: buyOption.name,
			active: buyOption.active
		};
	}

	let isDialogOpen = false;

</script>

{#await data.buyOptionData}
	<LoaderCircle class="animate-spin w-14 h-14 mx-auto" />
{:then buyOptions}
	<section in:fade class="mt-10 flex flex-col gap-y-8">
		{#if buyOptions?.totalElements > 0}
			{@const activeBuyOption = buyOptions?.buyOptions?.find((buyOption) => buyOption.active)}
			<nav class="flex justify-between gap-x-2">
				<BuyOptionSelector
					bind:isDialogOpen
					buyOptions={buyOptions?.buyOptions.map(mapBuyOptionToValue) ?? []}
					value={$page.params.buyOptionId}
					onSelect={async (value) =>{
						await goto(`/admin/events/${$page.params.id}/buy-options/${value}`)
						await invalidate("buyOption"); }}
				/>
				<DeleteBuyOption />
				<div class="flex-grow"></div>
				<form action="?/activateBuyOption" method="post">
					<Button
						type="submit"
						disabled={!$page.params.buyOptionId || $page.params.buyOptionId === activeBuyOption?.id}
					>{$_("admin-pages.events.buy-options.publish")}</Button
					>
				</form>
			</nav>
			<slot />
		{:else}
			<NoDataFound
				onButtonClick={() => (isDialogOpen = true)}
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
	<LoaderCircle class="animate-spin w-16 h-16" />
{:then createForm}
	<CreateBuyOption bind:isDialogOpen {createForm} />
{:catch error}
	<p class="text-red-500">Error: {error.message}</p>
{/await}
