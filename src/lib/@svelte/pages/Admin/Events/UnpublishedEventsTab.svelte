<script lang="ts">
	import { _ } from '@services';
	import { GridIcon, ListIcon } from '$lib/@svelte/icons';
	import { ButtonIcon, EventInfoBox, InfoListItem, SearchInput } from '$lib/@svelte/components';

	interface Props {
		unpublishedEvents?: {
			heading: string;
			subHeading: string | undefined;
			date: string | null;
			id: string;
		}[];
		handleEventRegistration?: (id: string) => void;
	}

	let { unpublishedEvents = [], handleEventRegistration = () => {} }: Props = $props();

	let isListView = $state(true);
</script>

<section class=" mt-10 flex justify-between w-full">
	<SearchInput placeholder={$_('common.search')} />
	<div>
		<ButtonIcon
			onClick={() => (isListView = false)}
			classes={` mr-1 ${!isListView ? 'text-brand!' : ''}`}
		>
			<GridIcon />
		</ButtonIcon>
		<ButtonIcon onClick={() => (isListView = true)} classes={`${isListView ? 'text-brand!' : ''}`}>
			<ListIcon />
		</ButtonIcon>
	</div>
</section>
<section class=" mt-6">
	{#if isListView}
		<div class="grid grid-cols-1 gap-8">
			{#each unpublishedEvents as { heading, subHeading, date, id }, index (index)}
				<InfoListItem
					{heading}
					{subHeading}
					{date}
					onRegisterClick={() => handleEventRegistration(id)}
					buttonText={$_('admin-pages.events.viewDetails')}
				/>
			{/each}
		</div>
	{:else}
		<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
			{#each unpublishedEvents as { heading, subHeading, date, id }, index (index)}
				<EventInfoBox
					{heading}
					{subHeading}
					{date}
					onRegisterClick={() => handleEventRegistration(id)}
					buttonText={'viewDetails'}
				/>
			{/each}
		</div>
	{/if}
</section>
