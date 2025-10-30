<script lang="ts">
	import { EventDetails } from '@/@svelte/modules';
	import { getActiveBuyOption, getEventDetails } from '@/remote/functions/events.remote.js';
	import { LoaderCircle } from '@lucide/svelte';

	let { params } = $props();

	let eventQuery = getEventDetails(params.eventId);
	let eventBuyOptions = getActiveBuyOption(params.eventId);
</script>

{#if eventQuery.loading || eventBuyOptions.loading}
	<LoaderCircle class="size-16 mx-auto animate-spin" />
{:else if eventQuery.ready && eventBuyOptions.ready}
	<EventDetails
		event={eventQuery.current}
		buyOption={eventBuyOptions.current}
		orgSlug={params.organizationSlug}
	/>
{/if}
