<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { NoDataFound, EventInfoBox, Button, Table, Chip } from '@/@svelte/components';
	import { ImageIcon, DocumentIcon, BrandingIcon } from '@/@svelte/icons';
	import type { PageData } from './$types';
	import { currentOrganizationSlugStore } from '@/stores/currentOrganizationSlugStore';

	const handleEventRegistration = (id: string) => {
		goto(`/${$currentOrganizationSlugStore}/events/${id}`);
	};
	let showListings: boolean = false;
	const handleViewAllEvent = () => {
		goto('/events');
	};
	const toggleListing = () => {
		showListings = true;
	};
	const columns = ['event', 'location', 'date', 'status', 'uploads'];

	interface EventListType {
		event: string;
		location: string;
		date: string;
		statusText: string;
	}

	export let data: PageData;

	let events = data.events ?? [];
	let eventRegistrations = data.eventRegistrations;
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.dashboard.dashboard')}</h1>
	<h4 class=" text-stone-500">
		{$_('user-pages.dashboard.subHeading', {
			values: { name: data.session?.user?.nickname ?? data.session?.user?.name }
		})}
	</h4>

	<section class=" mt-10">
		<div class=" flex justify-between items-center w-full mb-4">
			<h2 class=" text-stone-950 font-extrabold text-2xl mb-4">
				{$_('user-pages.dashboard.upcomingEvents')}
			</h2>
			<Button onClick={handleViewAllEvent} classes=" shadow-custom  !py-2"
			>{$_('common.viewAll')}</Button
			>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
			{#each events as { name, location, dateFrom, id }, index (index)}
				<EventInfoBox
					heading={name}
					subHeading={location}
					date={dateFrom}
					href={`/${$currentOrganizationSlugStore}/events/${id}`}
				/>
			{/each}
		</div>
	</section>

	<section class=" mt-10">
		<div class=" flex justify-between items-center w-full mb-4">
			<h2 class=" text-stone-950 font-extrabold text-2xl mb-4">
				{$_('user-pages.dashboard.registeredEvents')}
			</h2>
		</div>
		<div class="mt-2">
			{#if eventRegistrations?.totalElements && eventRegistrations?.eventRegistrations }
				<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
					{#each eventRegistrations.eventRegistrations as { event, id }, index (index)}
						<EventInfoBox
							heading={event.name}
							subHeading={event.location}
							date={event.dateFrom}
							href={`/${$currentOrganizationSlugStore}/events/${id}`}
						/>
					{/each}
				</div>
			{:else}
				<NoDataFound
					heading={$_('user-pages.dashboard.noEventsRegistered')}
					subHeading={$_('user-pages.dashboard.noEventsRegisteredDetail')}
					buttonText={$_('common.viewEvents')}
					onButtonClick={toggleListing}
				/>
			{/if}
		</div>
	</section>
</div>
