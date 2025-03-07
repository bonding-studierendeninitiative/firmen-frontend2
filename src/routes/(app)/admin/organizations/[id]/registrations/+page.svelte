<script lang="ts">
	import { InfoListItem, NoDataFound } from '$lib/@svelte/components';
	import { _ } from '@services';
	import { LoaderCircle } from 'lucide-svelte';

	export let data;
</script>

<section>
	{#await data.eventRegistrationData.eventRegistrations}
		<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
		{:then eventRegistrations}
	<div class="grid grid-cols-1 gap-8">
		{#if eventRegistrations.length > 0}
			{#each eventRegistrations as { event: { name, location, dateFrom }, id } (id)}
				<InfoListItem heading={name} subHeading={location} date={dateFrom} showButton={false} />
			{/each}
		{:else }
			<NoDataFound heading={$_("admin-pages.organizations.eventRegistrations.none-found")} />
		{/if}

	</div>
	{:catch error}
		<p>{error.message}</p>
	{/await}
</section>
