<script lang="ts">
	import { CalenderIcon, LocationIcon } from '@/@svelte/icons';
	import { dayjs, locale } from '@services';

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
			<p
				class=" ml-2 text-sm text-stone-800 font-medium">{dayjs(event?.dateFrom, { locale: $locale ?? "de" }).format('ll')}</p>
		</div>
		<div class=" flex items-center">
			<LocationIcon />
			<p class=" ml-2 text-sm text-stone-800 font-medium">{event?.location}</p>
		</div>
	</div>
</div>
