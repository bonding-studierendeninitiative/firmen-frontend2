<script lang="ts">
	import { EventRegistrationCheckout } from '@/@svelte/modules';
	import { getActiveBuyOption, getEventDetails } from '@/remote/functions';
	import { LoaderCircle } from '@lucide/svelte';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import SuperDebug from 'sveltekit-superforms';

	let { params } = $props();

	let queryParams = queryParameters(
		{
			selectedPackage: ssp.string(),
			selectedEventDays: ssp.array<string>(),
			selectedAddons: ssp.array<string>(),
			selectedAddonPackages: ssp.array<string>()
		},
		{
			showDefaults: false
		}
	);

	let eventQuery = getEventDetails(params.eventId);
	let eventBuyOptions = getActiveBuyOption(params.eventId);
</script>

{#if eventQuery.loading || eventBuyOptions.loading}
	<LoaderCircle class="size-10 mx-auto animate-spin" />
{:else if eventQuery.ready && eventBuyOptions.ready}
	<EventRegistrationCheckout
		event={eventQuery.current}
		buyOption={eventBuyOptions.current}
		addonPackages={eventBuyOptions.current?.addonPackages}
		orgSlug={params.organizationSlug}
	/>
{/if}

<SuperDebug data={queryParams} />
