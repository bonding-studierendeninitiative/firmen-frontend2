<script lang="ts">
	import { _ } from '@services';
	import { EventInfoBox, InfoListItem } from '$lib/@svelte/components';

	export let publishedEvents: { heading: string; subHeading: string | undefined; date: string | null; id: string }[] =
		[];
	export let handleEventRegistration: (id: string) => void = () => {
	};
	export let handleBuyOptions: (id: string) => void = () => {
	};

	export let isListView;
</script>
<section class=" mt-6">
	{#if isListView}
		<div class="grid grid-cols-1 gap-6">
			{#each publishedEvents as { heading, subHeading, date, id }, index (index)}
				<InfoListItem
					{heading}
					{subHeading}
					{date}
					onRegisterClick={() => handleEventRegistration(id)}
					onBuyOptionsClick={() => handleBuyOptions(id)}
					buttonText={$_('admin-pages.events.viewRegistrations')}
				/>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
			{#each publishedEvents as { heading, subHeading, date, id }, index (index)}
				<EventInfoBox
					{heading}
					{subHeading}
					{date}
					onRegisterClick={() => handleEventRegistration(id)}
					buttonText={'viewRegistrations'}
				/>
			{/each}
		</div>
	{/if}
</section>
