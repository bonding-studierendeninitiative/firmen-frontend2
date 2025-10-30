<script lang="ts">
	import { EventRegistrationCheckout } from '@/@svelte/modules';
	import { getActiveBuyOption, getEventDetails } from '@/remote/functions';
	import { LoaderCircle } from '@lucide/svelte';

	let { params } = $props();

	let eventQuery = getEventDetails(params.eventId);
	let eventBuyOptions = getActiveBuyOption(params.eventId);
</script>

{#if eventQuery.loading || eventBuyOptions.loading}
	<LoaderCircle class="size-10 mx-auto animate-spin" />
{:else if eventQuery.ready && eventBuyOptions.ready}
	<EventRegistrationCheckout
		event={eventQuery.current}
		buyOption={eventBuyOptions.current}
		addonPackages={eventBuyOptions.current?.addons}
		orgSlug={params.organizationSlug}
	/>
{/if}
