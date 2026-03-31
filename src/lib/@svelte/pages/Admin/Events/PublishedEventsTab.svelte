<script lang="ts">
	import { _ } from '@services';
	import { EventInfoBox, InfoListItem } from '$lib/@svelte/components';

	interface Props {
		publishedEvents?: {
			heading: string;
			subHeading: string | undefined;
			date: string | null;
			id: string;
		}[];
		handleEventRegistration?: (id: string) => void;
		handleBuyOptions?: (id: string) => void;
		isListView: any;
	}

	let {
		publishedEvents = [],
		handleEventRegistration = () => {},
		handleBuyOptions = () => {},
		isListView
	}: Props = $props();
</script>

<section class=" mt-6">
	{#if isListView}
		<div class="grid grid-cols-1 gap-6">
			{#each publishedEvents as { heading, subHeading, date, id }, index (index)}
				<InfoListItem
					{heading}
					{subHeading}
					{date}
					showButton={true}
					onRegisterClick={() => handleEventRegistration(id)}
					onBuyOptionsClick={() => handleBuyOptions(id)}
					buttonText={$_('admin-pages.events.viewRegistrations')}
				/>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-4">
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
