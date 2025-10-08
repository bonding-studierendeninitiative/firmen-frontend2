<script lang="ts">
	import { page } from '$app/state';
	import { EventRegistrationCheckout } from '@/@svelte/modules';
	import { getActiveBuyOption, getEventDetails } from '@/remote/functions';
	import { LoaderCircle } from '@lucide/svelte';

	let eventQuery = getEventDetails(page.params.eventId!);
	let eventBuyOptions = getActiveBuyOption(page.params.eventId!);
</script>

{#if eventQuery.loading || eventBuyOptions.loading}
	<LoaderCircle class="size-10 mx-auto animate-spin" />
{:else if eventQuery.ready && eventBuyOptions.ready}
	<EventRegistrationCheckout
		event={eventQuery.current}
		buyOption={eventBuyOptions.current}
		addonPackages={eventBuyOptions.current?.addons}
		orgSlug={page.params.organizationSlug!}
	/>
{/if}
