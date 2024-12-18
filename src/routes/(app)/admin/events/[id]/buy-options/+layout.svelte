<script lang="ts">
	import type { LayoutServerData } from './$types';
	import { NoDataFound, Spinner } from '@/@svelte/components';
	import { navigating, page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { DeleteBuyOption, BuyOptionSelector, CreateBuyOption } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';

	export let data: LayoutServerData;

	$: items =
		data.buyOptions?.map((buyOption) => ({
			value: buyOption.id,
			name: buyOption.name,
			label: buyOption.name,
			active: buyOption.active
		})) ?? [];

	let isDialogOpen = false;

	$: activeBuyOption = data.buyOptions?.find((buyOption) => buyOption.active);
</script>

<section class="mt-10 flex flex-col gap-y-8">
	{#if data.buyOptionCount > 0}
		<nav class="flex justify-between gap-x-2">
			<BuyOptionSelector
				bind:isDialogOpen
				buyOptions={items}
				value={$page.params.buyOptionId}
				onSelect={(value) => goto(`/admin/events/${$page.params.id}/buy-options/${value}`)}
			/>
			<DeleteBuyOption />
			<div class="flex-grow" />
			<form action="?/activateBuyOption" method="post">
				<Button
					type="submit"
					disabled={!$page.params.buyOptionId || $page.params.buyOptionId === activeBuyOption?.id}
					>{$_("admin-pages.events.buy-options.publish")}</Button
				>
			</form>
		</nav>
		{#if $navigating?.to?.url.pathname.includes('/buy-options/')}
			<div class="grid justify-center items-center h-full text-orange-400">
				<Spinner color="red" />
			</div>
		{:else}
			<div in:fade>
				<slot />
			</div>
		{/if}
	{:else}
		<NoDataFound
			onButtonClick={() => (isDialogOpen = true)}
			buttonText="Create a new buy option&hellip;"
			heading="This event does not have any buy options yet."
			subHeading="Create a buy option now to enable organizations to sign up to this event."
		/>
	{/if}
</section>
<CreateBuyOption bind:isDialogOpen createForm={data.createForm} />
