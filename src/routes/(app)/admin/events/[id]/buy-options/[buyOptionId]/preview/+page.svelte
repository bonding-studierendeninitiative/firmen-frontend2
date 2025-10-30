<script lang="ts">
	import { _ } from '@services';
	import { getContext } from 'svelte';
	import { BuyOptionPreview } from '@/@svelte/modules';
	import type { RemoteQuery } from '@sveltejs/kit';
	import type { GetEventBuyOptionOutput } from '@api/admin-client';

	let { params } = $props();
	let eventId = params.id;
	let buyOptionId = params.buyOptionId;

	// Use the shared query instance from the layout
	let getBuyOptionQuery = getContext<RemoteQuery<GetEventBuyOptionOutput>>('sharedBuyOptionQuery');
	let data = $derived(getBuyOptionQuery.current);
</script>

{#if data}
	<BuyOptionPreview buyOption={data} />
{/if}
