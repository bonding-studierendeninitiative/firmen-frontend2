<script lang="ts">
	import { goto } from '$app/navigation';
	import { NoDataFound, EventInfoBox } from '$lib/@svelte';
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

	const cities = ['Berlin', 'Köln', 'Düsseldorf', 'München', 'Nuremberg'];
	const handleEventRegistration = (id: string) => {
		console.log(id);
	};
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">Events</h1>
	<h4 class=" text-stone-500">Have a look at recent events for showcasing your company!</h4>
	<section class=" mt-10">
		{#each cities as city}
			<label
				class=" mr-2 inline-flex items-center px-3 py-2 rounded-md border border-solid border-stone-300"
			>
				<input type="checkbox" value={city} class="mr-2 !p-8 w-4 h-4" />
				{city}
			</label>
		{/each}
	</section>

	<section class=" mt-6">
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
</div>
