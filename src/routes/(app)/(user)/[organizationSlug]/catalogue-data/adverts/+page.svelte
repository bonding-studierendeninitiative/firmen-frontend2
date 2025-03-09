<script lang="ts">
	import { AdvertisementItem, NoDataFound } from '@/@svelte/components';
	import type { PageServerData } from './$types';
	import { dayjs } from '@services/i18n';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let data: PageServerData;

</script>
{#await data.advertisements}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then advertisements}
	<div in:fade>
	{#if !advertisements?.length}
		<NoDataFound heading="No advertisements found" subHeading="You can create one from the advertisements page"
								 buttonText="Create advertisement" onButtonClick={() => {

		}} />
	{:else}
		{@const groupedAdvertisements = advertisements?.reduce((acc, advertisement) => {
			const year = dayjs(advertisement.eventRegistration?.createdAt).year();

			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(advertisement);
			return acc;
		}, {})}
		{#each Object.entries(groupedAdvertisements) as [year, advertisements]}
			<div class="space-y-4">
				<h2 class="text-xl font-bold border-b">{year}</h2>
				<div class="grid grid-cols-2 gap-4">
					{#each advertisements as advertisement}
						<AdvertisementItem {advertisement} />
					{/each}
				</div>
			</div>
		{/each}
	{/if}
	</div>
{:catch error}
	<p>{error.message}</p>
{/await}
