<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageServerData } from './$types';
	import { Tabs } from '$lib/@svelte/components';
	import { _ } from '@services';
	import { Button } from '@/components/ui/button';
	import { PublishedEventsTab, UnpublishedEventsTab } from '@/@svelte/pages';

	export let data: PageServerData;

	const mapEvent = (event: {
		id: string;
		name: string;
		projectHSG: string;
		dateFrom: string | null;
		dateTo?: string | null;
		location: string;
	}) => {
		return {
			id: event.id,
			heading: event.name,
			subHeading: event.location,
			date: event.dateFrom
		};
	};

	const publishedEvents = data.publishedEvents?.map(mapEvent) || [];
	const unpublishedEvents = data.unpublishedEvents?.map(mapEvent) || [];
	const archivedEvents = data.archivedEvents?.map(mapEvent) || [];

	let activeTab = 0;
	const tabHeadings = ['published', 'unpublished', 'archived'] as const;

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};

</script>

<div>
	<div class=" flex justify-between items-end">
		<div>
			<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('admin-pages.events.heading')}</h1>
			<h4 class=" text-stone-500">{$_('admin-pages.events.subHeading')}</h4>
		</div>
		{#if activeTab !== 1}
			<div>
				<Button variant="gradient" on:click={() => (activeTab = 1)}>
					{$_('admin-pages.events.publishNewEvents')}
				</Button>
			</div>
		{/if}
	</div>
	<div class=" mt-12">
		<Tabs {tabHeadings} {activeTab} {handleTabChange} />
	</div>
	{#if activeTab === 0}
		<PublishedEventsTab
			{publishedEvents}
			handleEventRegistration={id => goto(`/admin/events/${id}/registrations/`)}
			handleBuyOptions={id => goto(`/admin/events/${id}/buy-options/`)}
		/>
	{/if}
	{#if activeTab === 1}
		<UnpublishedEventsTab
			{unpublishedEvents}
			handleEventRegistration={(id) => {
				goto(`/admin/events/${id}/registrations/`);
			}}
		/>
	{/if}
	{#if activeTab === 2}
		<PublishedEventsTab
			publishedEvents={archivedEvents}
			handleEventRegistration={id => goto(`/admin/events/${id}/registrations/`)}
		/>
	{/if}
</div>
