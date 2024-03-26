<script lang="ts">
	import { goto } from '$app/navigation';
	import { NoDataFound, EventInfoBox, SimpleDocumentIcon } from '$lib/@svelte';
	import Button from '$lib/@svelte/components/Button/Button.svelte';
	import { Table } from '$lib/@svelte/components';
	import Chip from '$lib/@svelte/components/Chip/Chip.svelte';
	import ImageIcon from '$lib/@svelte/icons/ImageIcon.svelte';
	import DocumentIcon from '$lib/@svelte/icons/DocumentIcon.svelte';
	import BrandingIcon from '$lib/@svelte/icons/BrandingIcon.svelte';

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
		console.log(id);
	};
	let showListings: boolean = false;
	const handleViewAllEvent = () => {
		goto('/events');
	};
	const toggleListing = () => {
		showListings = true;
	};
	const columns = ['Event', 'Location', 'Date', 'Status', 'Uploads'];
	interface EventListType {
		event: string;
		location: string;
		date: string;
		status: 'success' | 'info';
		statusText: string;
	}

	const eventList: EventListType[] = [
		{
			event: 'Tech Foundation 2023',
			location: 'Philipps University of Marburg',
			date: '01.12.24 - 25.12.24',
			status: 'info',
			statusText: 'Überprüfung'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Philipps University of Marburg',
			date: '25.12.24',
			status: 'success',
			statusText: 'Bestätigt'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Free University of Berlin',
			date: '01.12.24 - 25.12.24',
			status: 'info',
			statusText: 'Überprüfung'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Free University of Berlin',
			date: '01.12.24 - 25.12.24',
			status: 'info',
			statusText: 'Überprüfung'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Free University of Berlin',
			date: '01.12.24 - 25.12.24',
			status: 'info',
			statusText: 'Überprüfung'
		}
	];

	const colors = ['#EA580C', '#EAB308', '#B91C1C', '#15803D', '#155E75', '#9D174D'];
	const portraits = [
		'Energieversersorgung',
		'Softwareentwicklung',
		'Architektur',
		'Biologie',
		'Jura',
		'Wirstchafts'
	];
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">Portraits</h1>
	<h4 class=" text-stone-500">Have a look at recent events for showcasing your company</h4>

	{#if !showListings}
		<section class=" mt-10">
			<div class="mt-2">
				<NoDataFound
					heading="No events registered yet!"
					subHeading="There are no portraits profiles to display yet. Please create a new portrait and use to register to your favorite events."
					buttonText="New Portrait"
					onButtonClick={toggleListing}
				/>
			</div>
		</section>
	{:else}
		<section class=" mt-10">
			{#each portraits as portrait, index}
				<div class=" flex justify-between items-center mb-6">
					<div class=" flex">
						<div
							style={`background-color:${colors[index % 6]} ;`}
							class={`rounded-lg inline-flex justify-center items-center  w-12 h-12`}
						>
							<SimpleDocumentIcon />
						</div>
						<div class=" flex flex-col ml-4">
							<h3 class=" text-base font-extrabold text-stone-800">{portrait}</h3>
							<h4 class=" text-sm font-normal text-stone-800">Portrait # {index + 1}</h4>
						</div>
					</div>
					<Button onClick={handleViewAllEvent} classes=" inline shadow-custom !py-1"
						>View Details</Button
					>
				</div>
			{/each}
		</section>
	{/if}
</div>
