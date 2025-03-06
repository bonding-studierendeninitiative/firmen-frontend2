<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;
	import { EventRegistrationCheckout } from '@/@svelte/modules';
	import { LoaderCircle } from 'lucide-svelte';

</script>

{#await data.eventRegistrationData}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then eventDetails}
	<EventRegistrationCheckout event={eventDetails?.event}
														 buyOption={eventDetails?.buyOption}
														 addonPackages={eventDetails?.addons}
														 orgSlug={eventDetails?.orgSlug}
														 createEventRegistrationForm={eventDetails?.createEventRegistrationForm} />
{:catch error}
	<p>{error.message}</p>
{/await}
