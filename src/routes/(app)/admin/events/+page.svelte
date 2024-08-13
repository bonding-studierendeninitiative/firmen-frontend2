<script lang="ts">
	import { goto } from '$app/navigation';
	import type { PageServerData } from './$types';
	import {
		GradientButton,
		Tabs
	} from '$lib/@svelte/components';
	import { EventDetails } from '$lib/@svelte/modules';
	import { _ } from '@services';
	import PublishedEventsTab from '$lib/@svelte/pages/Admin/Events/PublishedEventsTab.svelte';
	import UnpublishedEventsTab from '$lib/@svelte/pages/Admin/Events/UnpublishedEventsTab.svelte';

	export let data: PageServerData;

	const mapEvent = (event: {
		id: string
		name: string
		projectHSG: string
		dateFrom: string
		dateTo: string
		location: string
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

	let isDrawerOpen = false;
	let activeTab = 0;
	const tabHeadings = ['published', 'unpublished', 'archived'];

	const handleTabChange = (tabIndex: number) => {
		activeTab = tabIndex;
	};

	const handleEventRegistration = (id: string) => {
		if (activeTab !== 1) {
			goto(`/admin/events/${id}/registrations/`);
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
	{#if activeTab === 0}
		<PublishedEventsTab {publishedEvents} {handleEventRegistration} {isListView} />
	{/if}
	{#if activeTab === 1}
		<UnpublishedEventsTab {unpublishedEvents} {handleEventRegistration} {isListView} />
	{/if}
	{#if activeTab === 2}
		<PublishedEventsTab {archivedEvents} {handleEventRegistration} {isListView} />
	{/if}
</div>
<EventDetails bind:isOpen={isDrawerOpen} showActions />
