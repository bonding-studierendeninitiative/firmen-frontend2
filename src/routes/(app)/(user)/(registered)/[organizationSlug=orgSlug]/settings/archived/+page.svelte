<script lang="ts">
	import { _ } from '@services';
	import { Table } from '$lib/@svelte/components';
	import Button from '$lib/@svelte/components/Button/Button.svelte';

	const columns = ['event', 'location', 'date', ''];
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

	let isEventDetailsDrawerOpen = false;
</script>

<div>
	<section>
		<h2 class=" text-stone-800 text-lg font-extrabold">
			{$_('user-pages.settings.archivedEvents')}
		</h2>
	</section>
	<section class=" mt-10">
		<Table totalRecords={9} {columns}>
			{#each eventList as { event, location, date }, index}
				<tr class={` ${index % 2 !== 0 ? 'bg-gray-50' : 'bg-white'}`}>
					<td class=" px-6 py-4 text-grey-900 text-sm">{event}</td>
					<td class=" px-6 py-4 text-grey-900 text-sm">{location}</td>
					<td class=" px-6 py-4 text-grey-500 text-sm">{date}</td>
					<td class=" px-6 py-4"
						><Button classes=" !py-1.5 !px-4 " onClick={() => (isEventDetailsDrawerOpen = true)}
							>{$_('common.viewDetails')}</Button
						></td
					>
				</tr>
			{/each}
		</Table>
	</section>
</div>
