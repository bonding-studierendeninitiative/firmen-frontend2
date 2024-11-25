<script lang="ts">
	import { _ } from '@services';
	import { EventInfoBox } from '@/@svelte/components';
	import { currentOrganizationSlugStore } from '@/stores/currentOrganizationSlugStore';
	import type { PageData } from './$types';
	import { Checkbox } from '@/components/ui/checkbox';
	import { Label } from '@/components/ui/label';

	export let data: PageData;
	let events = data.events ?? [];

	let cities = [...new Set(events.map((item) => item.projectHSG))];
	let checkedCities: string[] = cities;

	function addItem(city: string) {
		checkedCities = [...checkedCities, city];
	}

	function removeItem(city: string) {
		checkedCities = checkedCities.filter((i) => i !== city);
	}
</script>

<div>
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.events.events')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.events.eventsSubHeading')}</h4>
	{#if events.length === 0}
		<p class="container mt-8 flex justify-center items-center h-full">{$_('user-pages.events.noEvents')}</p>
	{/if}
	<section class=" mt-10">
		{#each cities as city}
			{@const checked = checkedCities.includes(city)}
			<Label
				class=" mr-2 inline-flex items-center px-3 py-3 rounded-md border border-solid border-stone-300"
			>
				<Checkbox
					id="terms"
					class="mr-2"
					{checked}
					onCheckedChange={(v) => {
						if (v) {
							addItem(city);
						} else {
							removeItem(city);
						}
					}}
				/>
				{city}
			</Label>
		{/each}
	</section>
	<section class=" mt-6">
		<div class="grid grid-cols-1 sm:grid-cols-1 md:sm:grid-cols-1 lg:sm:grid-cols-2 gap-8">
			{#each events as { name, location, dateFrom, id, projectHSG }, index (index)}
				{#if checkedCities.includes(projectHSG)}
					<EventInfoBox
						heading={name}
						subHeading={location}
						date={dateFrom}
						href={`/${$currentOrganizationSlugStore}/events/${id}`}
					/>
				{/if}
			{/each}
		</div>
	</section>
</div>
