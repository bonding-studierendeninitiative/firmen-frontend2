<script lang="ts">
	import { page } from '$app/stores';
	import type { PageData } from './$types';
	import { EventDetails } from '@/@svelte/modules';
	import { LoaderCircle } from 'lucide-svelte';

	export let data: PageData;
</script>

{#await data.eventDetails}
	<LoaderCircle class="h-16 w-16 mx-auto animate-spin" />
{:then { event, buyOption, addons }}
	<EventDetails {event} {buyOption} {addons} orgSlug={$page.params.organizationSlug} />
{:catch error}
	<p>{error.message}</p>
{/await}
