<script lang="ts">
	import { AdvertisementItem, NoDataFound } from '@/@svelte/components';
	import type { PageServerData } from './$types';
	import { dayjs } from '@services/i18n';
	import { LoaderCircle, Plus } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { UploadAdvertisementDialog } from '@/@svelte/modules/UploadAdvertisementDialog';
	import { Button } from '@/components/ui/button';

	export let data: PageServerData;
	let isUploadOpen = false;

</script>
{#await data.advertisementData}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then advertisementData}
	<div in:fade>
		{#if advertisementData?.data?.advertisements?.length <= 0}
			<NoDataFound heading="No advertisements found" subHeading="You can create one from the advertisements page"
									 buttonText="Upload an advertisement" onButtonClick={() => {
isUploadOpen = true;
		}} />
		{:else}
			{@const groupedAdvertisements = advertisementData?.data?.advertisements?.reduce((acc, advertisement) => {
				const year = dayjs().year();

				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(advertisement);
				return acc;
			}, {})}
			<div class="flex justify-end">
				<Button class="mr-2" on:click={() => {isUploadOpen = true;}}>
					<Plus class="h-4 w-4 mr-2" />
					Upload an advertisement
				</Button>
			</div>
			{#each Object.entries(groupedAdvertisements) as [year, advertisements]}
				<div class="space-y-4 @container/adverts">
					<h2 class="text-xl font-bold border-b">{year}</h2>
					<div class="grid grid-cols-1 @lg:grid-cols-2 @3xl/adverts:grid-cols-3 @5xl/adverts:grid-cols-4 gap-4">
						{#each advertisements as advertisement}
							<AdvertisementItem {advertisement} />
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</div>
	<UploadAdvertisementDialog bind:open={isUploadOpen} advertisementUploadForm={advertisementData?.uploadForm} />
{:catch error}
	<p>{error.message}</p>
{/await}
