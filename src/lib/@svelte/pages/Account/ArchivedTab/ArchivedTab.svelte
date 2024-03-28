<script lang="ts">
	import { Table } from '$lib';
	import Button from '$lib/@svelte/components/Button/Button.svelte';

	const columns = ['Event', 'Location', 'Date', ''];
	interface EventListType {
		event: string;
		location: string;
		date: string;
	}

	const eventList: EventListType[] = [
		{
			event: 'Tech Foundation 2023',
			location: 'Philipps University of Marburg',
			date: '01.12.24 - 25.12.24'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Philipps University of Marburg',
			date: '25.12.24'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Free University of Berlin',
			date: '01.12.24 - 25.12.24'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Free University of Berlin',
			date: '01.12.24 - 25.12.24'
		},
		{
			event: 'Tech Foundation 2023',
			location: 'Free University of Berlin',
			date: '01.12.24 - 25.12.24'
		}
	];
</script>

<div>
	<section>
		<h2 class=" text-stone-800 text-lg font-extrabold">Archived Events</h2>
	</section>
	<section>
		<section class=" mt-10">
			<Table totalRecords={9} {columns}>
				{#each eventList as { event, location, date }, index}
					<tr class={` ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
						<td class=" px-6 py-4 text-grey-900 text-sm">{event}</td>
						<td class=" px-6 py-4 text-grey-900 text-sm">{location}</td>
						<td class=" px-6 py-4 text-grey-500 text-sm">{date}</td>
						<td class=" px-6 py-4"><Button onClick={() => undefined}>View Details</Button></td>
					</tr>
				{/each}
			</Table>
		</section>
	</section>
</div>
