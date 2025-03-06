<script lang="ts">
	import { Checkbox } from '@/components/ui/checkbox';
	import { Label } from '@/components/ui/label';
	import { EventInfoBox } from '@/@svelte/components';
	import type { InferOutput } from 'valibot';
	import type { GetEventsResponse } from '@schema';

	export let events: InferOutput<GetEventsResponse>['events'];
	export let orgSlug: string;

	let cities = [...new Set(events.map((item) => item.projectHSG))];
	let checkedCities: string[] = cities;

	function addItem(city: string) {
		checkedCities = [...checkedCities, city];
	}

	function removeItem(city: string) {
		checkedCities = checkedCities.filter((i) => i !== city);
	}
</script>

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
					href={`/${orgSlug}/events/${id}`}
				/>
			{/if}
		{/each}
	</div>
</section>