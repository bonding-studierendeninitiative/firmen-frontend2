<script lang="ts">
	import { EventRegistrationCheckout } from '@/@svelte/modules';
	import { LoaderCircle } from '@lucide/svelte';

	let { data } = $props();
</script>

{#await data.eventRegistrationData}
	<LoaderCircle class="size-10 mx-auto animate-spin" />
{:then eventDetails}
	<EventRegistrationCheckout
		event={eventDetails?.event}
		buyOption={eventDetails?.buyOption}
		addonPackages={eventDetails?.addons}
		orgSlug={eventDetails?.orgSlug}
		createEventRegistrationForm={eventDetails?.createEventRegistrationForm}
	/>
{:catch error}
	<p>{error.message}</p>
{/await}
