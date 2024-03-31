<script lang="ts">
	import { InfoListItem } from '$lib/@svelte/components';

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
</script>

<section>
	<div class="grid grid-cols-1 gap-8">
		{#each upcomingEvents as { heading, subHeading, date, id }, index (index)}
			<InfoListItem {heading} {subHeading} {date} showButton={false} />
		{/each}
	</div>
</section>
