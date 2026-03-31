<script lang="ts">
	import { _ } from '@services';
	import { getContext } from 'svelte';
	import BuyOptionSettings from './buy-option-settings.svelte';
	import type { RemoteQuery } from '@sveltejs/kit';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';

	let { params } = $props();
	let eventId = params.id;
	let buyOptionId = params.buyOptionId;

	// Use the shared query instance from the layout
	let getBuyOptionQuery = getContext<RemoteQuery<GetEventBuyOptionOutput>>('sharedBuyOptionQuery');
</script>

{#if getBuyOptionQuery.loading}
	<div class="col-span-2">
		<p class="text-center text-muted-foreground">{$_('common.loading')}...</p>
	</div>
{/if}

{#if getBuyOptionQuery.ready && getBuyOptionQuery.current}
	{@const data = getBuyOptionQuery.current}
	<BuyOptionSettings
		{eventId}
		{buyOptionId}
		active={data.active ?? false}
		version={data.version ?? 0}
		name={data.name ?? ''}
		{getBuyOptionQuery}
	/>
{/if}
