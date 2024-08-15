<script lang="ts">
	import { _ } from '@services/i18n';
	import type { LayoutServerData } from './$types';
	import { Spinner } from '@/@svelte/components';
	import { navigating, page } from '$app/stores';
	import { goto } from '$app/navigation';
	import { fade } from 'svelte/transition';
	import { DeleteBuyOption, BuyOptionSelector } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { buyOptionFormTouched } from '@/stores/buyOptionStore';

	export let data: LayoutServerData;

	$: items = data.buyOptions?.map((buyOption) => ({
		value: buyOption.id,
		name: buyOption.name,
		label: buyOption.name,
		active: buyOption.active,
	})) ?? [];
</script>

<section class="mt-6 flex flex-col gap-y-4">
	<nav class="flex justify-between gap-x-2">
		<BuyOptionSelector createForm={data.createForm} buyOptions={items} value={$page.params.buyOptionId}
											 onSelect={(value) => goto(`/admin/events/${$page.params.id}/buy-options/${value}`)} />
		<DeleteBuyOption />
		<div class="flex-grow" />
		<form action="?/activateBuyOption" method="post">
			<Button type="submit" disabled={!$page.params.buyOptionId}>Activate</Button>
		</form>
		<Button class={cn($buyOptionFormTouched && "animate-pulse")} variant="default" form="edit-buy-option-form" type="submit">{$_('common.save')}</Button>
	</nav>
	{#if $navigating?.to?.url.pathname.includes("/buy-options/")}
		<div class="grid justify-center items-center h-full text-orange-400">
			<Spinner color="red" />
		</div>
	{:else}
		<div in:fade>
			<slot />
		</div>
	{/if}
</section>