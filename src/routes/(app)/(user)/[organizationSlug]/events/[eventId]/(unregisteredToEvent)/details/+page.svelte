<script lang="ts">
	import { page } from '$app/state';
	import { EventDetails } from '@/@svelte/modules';
	import { LoaderCircle } from '@lucide/svelte';

	let { data } = $props();
</script>

{#await data.eventDetails}
	<LoaderCircle class="size-16 mx-auto animate-spin" />
{:then {event, buyOption }}
	<EventDetails {event} {buyOption} orgSlug={page.params.organizationSlug} />
{:catch error}
	<p>{error.message}</p>
{/await}
