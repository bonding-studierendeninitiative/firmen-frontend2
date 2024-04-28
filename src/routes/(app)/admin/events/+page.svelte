<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		EventInfoBox,
		InfoListItem,
		SearchInput,
		GradientButton,
		ButtonIcon,
		Tabs
	} from '$lib/@svelte/components';
	import { GridIcon, ListIcon } from '$lib/@svelte/icons';
	import { EventDetails } from '$lib/@svelte/modules';
	import { _ } from '@services';

	const upcomingEvents = [
		{
			id: '1',
			heading: 'Tech Foundation 2023',
			subHeading: 'Free University of Berlin',
			date: '20 Dec, 2023'
		},
		{
			id: '2',
			heading: 'Engineer Fair 2024',
			subHeading: 'Philipps University of Marburg',
			date: '20 Dec, 2023'
		},
		{
			id: '1',
			heading: 'Tech Foundation 2023',
			subHeading: 'Free University of Berlin',
			date: '20 Dec, 2023'
		},
		{
			id: '2',
			heading: 'Engineer Fair 2024',
			subHeading: 'Philipps University of Marburg',
			date: '20 Dec, 2023'
		},
		{
			id: '1',
			heading: 'Tech Foundation 2023',
			subHeading: 'Free University of Berlin',
			date: '20 Dec, 2023'
		},
		{
			id: '2',
			heading: 'Engineer Fair 2024',
			subHeading: 'Philipps University of Marburg',
			date: '20 Dec, 2023'
		}
	];

	let isDrawerOpen = false;
	let activeTab = 0;
	const tabHeadings = ['published', 'unpublished', 'archived'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};

	const handleEventRegistration = (id: string) => {
		if (activeTab !== 1) {
			goto('/admin/events/applies/' + id);
		} else {
			isDrawerOpen = true;
		}
	};

	let isListView: boolean = false;
</script>

<div>
	<div class=" flex justify-between items-end">
		<div>
			<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('admin-pages.events.heading')}</h1>
			<h4 class=" text-stone-500">{$_('admin-pages.events.subHeading')}</h4>
		</div>
		{#if activeTab !== 1}
			<div>
				<GradientButton onClick={() => (activeTab = 1)}
					>{$_('admin-pages.events.publishNewEvents')}</GradientButton
				>
			</div>
		{/if}
	</div>
	<div class=" mt-12">
		<Tabs {tabHeadings} {activeTab} {handleTabChange} />
	</div>
	<section class=" mt-10 flex justify-between w-full">
		<SearchInput placeholder={$_('common.search')} />
		<div>
			<ButtonIcon
				onClick={() => (isListView = false)}
				classes={` mr-1 ${!isListView ? '!text-brand' : ''}`}><GridIcon /></ButtonIcon
			>
			<ButtonIcon onClick={() => (isListView = true)} classes={`${isListView ? '!text-brand' : ''}`}
				><ListIcon /></ButtonIcon
			>
		</div>
	</section>
	<section class=" mt-6">
		{#if isListView}
			<div class="grid grid-cols-1 gap-8">
				{#each upcomingEvents as { heading, subHeading, date, id }, index (index)}
					<InfoListItem
						{heading}
						{subHeading}
						{date}
						onRegisterClick={() => handleEventRegistration(id)}
						buttonText={activeTab !== 1
							? $_('admin-pages.events.viewApplies')
							: $_('common.viewDetails')}
					/>
				{/each}
			</div>
		{:else}
			<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
				{#each upcomingEvents as { heading, subHeading, date, id }, index (index)}
					<EventInfoBox
						{heading}
						{subHeading}
						{date}
						onRegisterClick={() => handleEventRegistration(id)}
						buttonText={activeTab !== 1 ? 'viewApplies' : 'viewDetails'}
					/>
				{/each}
			</div>{/if}
	</section>
</div>
<EventDetails bind:isOpen={isDrawerOpen} />
