<script lang="ts">
	import { CalenderIcon, LocationIcon } from '@/@svelte/icons';
	import { LocalizedDate } from '@/@svelte/components';
	import { Skeleton } from '@/components/ui/skeleton';

	let {
		event,
		loading = false
	}:
		| {
				loading: false;
				event: {
					name?: string | undefined;
					dateFrom?: string | null;
					location?: string;
				};
		  }
		| {
				loading: true;
				event: undefined;
		  } = $props();
</script>

<div>
	{#if loading}
		<Skeleton class="bg-gray-400 h-6 w-[20ch] mb-3" />
		<div class=" flex mt-2">
			<div class=" flex items-center mr-2">
				<CalenderIcon />
				<Skeleton class="bg-gray-400 h-4 w-[10ch] ml-2" />
			</div>
			<div class=" flex items-center">
				<LocationIcon />
				<Skeleton class="bg-gray-400 h-4 w-[10ch] ml-2" />
			</div>
		</div>
	{:else}
		<h4 class=" text-xl font-semibold text-stone-800">{event?.name}</h4>
		<div class=" flex mt-2">
			<div class=" flex items-center mr-2">
				<CalenderIcon />
				<LocalizedDate
					date={event?.dateFrom}
					format="medium"
					hoverFormat="relative"
					class=" ml-2 text-sm text-stone-800 font-medium"
				/>
			</div>
			{#if event?.location}
				<div class=" flex items-center">
					<LocationIcon />
					<p class=" ml-2 text-sm text-stone-800 font-medium">{event?.location}</p>
				</div>
			{/if}
		</div>
	{/if}
</div>
