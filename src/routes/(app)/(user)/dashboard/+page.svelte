<script lang="ts">
	import { _ } from '@services';
	import { goto } from '$app/navigation';
	import { NoDataFound, EventInfoBox, Button, Table, Chip } from '$lib/@svelte/components';
	import { ImageIcon, DocumentIcon, BrandingIcon } from '$lib/@svelte/icons';

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
		}
	];
	const handleEventRegistration = (id: string) => {
		goto('/events/' + id);
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

	const eventList: EventListType[] = [
		{
			event: 'Tech Foundation 2023',
			location: 'Philipps University of Marburg',
			date: '01.12.24 - 25.12.24',
			statusText: 'rejected'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Philipps University of Marburg',
			date: '25.12.24',
			statusText: 'confirmed'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Free University of Berlin',
			date: '01.12.24 - 25.12.24',
			statusText: 'rejected'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Free University of Berlin',
			date: '01.12.24 - 25.12.24',
			statusText: 'confirmed'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Free University of Berlin',
			date: '01.12.24 - 25.12.24',
			statusText: 'verification'
		}
	];
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.dashboard.dashboard')}</h1>
	<h4 class=" text-stone-500">
		{$_('user-pages.dashboard.subHeading', { values: { name: 'James' } })}
	</h4>

	<section class=" mt-10">
		<div class=" flex justify-between items-center w-full mb-4">
			<h2 class=" text-stone-950 font-extrabold text-2xl mb-4">
				{$_('user-pages.dashboard.upcomingEvents')}
			</h2>
			<Button onClick={handleViewAllEvent} classes=" shadow-custom !w-24 !py-2"
				>{$_('common.viewAll')}</Button
			>
		</div>
		<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
			{#each upcomingEvents as { heading, subHeading, date, id }, index (index)}
				<EventInfoBox
					{heading}
					{subHeading}
					{date}
					onRegisterClick={() => handleEventRegistration(id)}
				/>
			{/each}
		</div>
	</section>

	{#if !showListings}
		<section class=" mt-10">
			<div class=" flex justify-between items-center w-full mb-4">
				<h2 class=" text-stone-950 font-extrabold text-2xl mb-4">
					{$_('user-pages.dashboard.registeredEvents')}
				</h2>
			</div>
			<div class="mt-2">
				<NoDataFound
					heading={$_('user-pages.dashboard.noEventsRegistered')}
					subHeading={$_('user-pages.dashboard.noEventsRegisteredDetail')}
					buttonText={$_('common.viewEvents')}
					onButtonClick={toggleListing}
				/>
			</div>
		</section>
	{:else}
		<section class=" mt-10">
			<Table totalRecords={9} {columns}>
				{#each eventList as { event, location, date, statusText }, index}
					<tr class={` ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
						<td class=" px-6 py-4 text-grey-900 text-sm">{event}</td>
						<td class=" px-6 py-4 text-grey-900 text-sm">{location}</td>
						<td class=" px-6 py-4 text-grey-500 text-sm">{date}</td>
						<td class=" px-6 py-4"><Chip status={statusText} variant={statusText} /></td>
						<td class=" px-6 py-4">
							<button><ImageIcon /> </button>
							<button><DocumentIcon /> </button>
							<button><BrandingIcon /> </button>
						</td>
					</tr>
				{/each}
			</Table>
		</section>
	{/if}
</div>
