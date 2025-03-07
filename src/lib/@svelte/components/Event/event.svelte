<script lang="ts">
	import { CalenderIcon, LocationIcon } from '@/@svelte/icons';
	import { LocalizedDate } from '@/@svelte/components';

	export let event:
		| {
		name: string;
		dateFrom: string | null;
		location?: string;
	}
		| undefined;
</script>

<div>
	<h4 class=" text-xl font-semibold text-stone-800">{event?.name}</h4>
	<div class=" flex mt-2">
		<div class=" flex items-center mr-2">
			<CalenderIcon />
			<LocalizedDate date={event?.dateFrom}
										 format="medium"
										 hoverFormat="relative"
										 class=" ml-2 text-sm text-stone-800 font-medium" />
		</div>
		<div class=" flex items-center">
			<LocationIcon />
			<p class=" ml-2 text-sm text-stone-800 font-medium">{event?.location}</p>
		</div>
	</div>
</div>
