<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { EventDetails } from '@/@svelte/modules';

	export let data: PageData;
</script>

{#await data.eventDetails}
	<div>Loading...</div>
{:then { event, buyOption, addons }}
	<EventDetails {event} {buyOption} {addons} orgSlug={$page.params.organizationSlug} />
{:catch error}
	<p>{error.message}</p>
{/await}
