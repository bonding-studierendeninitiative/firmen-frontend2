<script lang="ts">
	import { CalenderIcon, LocationIcon } from '@/@svelte/icons';
	import dayjs from 'dayjs';
	import localizedFormat from 'dayjs/plugin/localizedFormat';

	dayjs.extend(localizedFormat);

	export let event: {
		name: string;
		dateFrom: string | null;
		location?: string;
	} | undefined;
</script>

<div>
	<h4 class=" text-xl font-extrabold text-stone-800">{event?.name}</h4>
	<div class=" flex mt-2">
		<div class=" flex items-center mr-2">
			<CalenderIcon />
			<p class=" ml-2 text-sm text-stone-800 font-medium">{dayjs(event?.dateFrom).format("ll")}</p>
		</div>
		<div class=" flex items-center">
			<LocationIcon />
			<p class=" ml-2 text-sm text-stone-800 font-medium">{event?.location}</p>
		</div>
	</div>
</div>