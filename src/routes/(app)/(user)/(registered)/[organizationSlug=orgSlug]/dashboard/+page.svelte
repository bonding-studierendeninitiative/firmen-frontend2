<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { NoDataFound, EventInfoBox, Button, Table, Chip, EventRegistrationInfoBox } from '@/@svelte/components';
	import type { PageData } from './$types';
	import { currentOrganizationSlugStore } from '@/stores/currentOrganizationSlugStore';
	import SuperDebug from 'sveltekit-superforms';
	import { RegisteredEventList } from '@/@svelte/modules/RegisteredEventList';


	export let data: PageData;
	let events = data.events ?? [];
	let eventRegistrations = data.eventRegistrations?.eventRegistrations || [];

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
			<!--
			{#if eventRegistrations.length > 0 }
				<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
					{#each eventRegistrations as eventRegistration (eventRegistration.id)}
						<EventRegistrationInfoBox
							{eventRegistration}
							date={eventRegistration.event.dateFrom}
							href={`/${$currentOrganizationSlugStore}/events/${eventRegistration.id}`}
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
			{/if}-->
			<RegisteredEventList bind:eventRegistrations={data.eventRegistrations}></RegisteredEventList>
		</div>
	</section>
</div>
