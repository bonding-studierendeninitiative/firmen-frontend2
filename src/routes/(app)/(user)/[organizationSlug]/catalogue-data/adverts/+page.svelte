<script lang="ts">
	import { AdvertisementItem, NoDataFound } from '@/@svelte/components';
	import { dayjs } from '@services/i18n';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';
	import { UploadAdvertisementDialog } from '@/@svelte/modules/UploadAdvertisementDialog';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';
	import { _ } from '@services';

	let { data } = $props();
	let isUploadOpen = $state(false);

	const api = trpc($page);
	const utils = api.createUtils();

	const [advertsQuery, resolveAdverts] =
		api.catalogueData.getAll.createInfiniteQuery(
			{ limit: '10', documentType: "advert" },
			{
				getNextPageParam: (lastPage) =>
					Math.max(Number(lastPage.pageNumber) + 1, Number(lastPage.totalPages) - 1).toString(),
				lazy: true
			}
		);
	const uploadFormQuery = api.catalogueData.uploadForm.createQuery(undefined, {
		staleTime: Infinity
	});

	const uploadForm = $uploadFormQuery.data;
</script>

<div in:fade class="space-y-4">
	<div class="flex justify-end">
		{#if $uploadFormQuery.isLoading}
			<Button class="min-w-32 mr-2" disabled>
				<LoaderCircle class="w-5 h-5 mx-auto animate-spin" />
			</Button>
		{:else if $uploadFormQuery.data}
			<UploadAdvertisementDialog
				bind:open={isUploadOpen}
				advertisementUploadForm={$uploadFormQuery.data}
			/>
		{/if}
	</div>
	{#await resolveAdverts(data.advertisementData)}
		<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
	{:then _ignored}
		{#if $advertsQuery?.data}
			{@const allAdverts = $advertsQuery.data.pages.flatMap((page) => page.documents)}
			{#if allAdverts.length === 0}
				<NoDataFound
					heading="No advertisements found"
					subHeading="You can create one from the advertisements page"
					buttonText="Upload an advertisement"
					onButtonClick={() => {
						isUploadOpen = true;
					}}
				/>
			{:else}
				{@const groupedAdvertisements = allAdverts
				.filter((advert) => advert != undefined)
				.reduce((acc, advertisement) => {
					const year = dayjs(advertisement.createdAt).year();

					if (!acc[year]) {
						acc[year] = [];
					}
					acc[year].push(advertisement);
					return acc;
				}, {})}
				{#each Object.entries(groupedAdvertisements).sort( ([ayear, aadverts], [byear, badverts]) => byear.localeCompare(ayear) ) as [year, advertisements]}
					<div class="space-y-4 @container/adverts">
						<h2 class="text-xl font-bold border-b">{year}</h2>
						<div
							class="grid grid-cols-1 @lg:grid-cols-2 @3xl/adverts:grid-cols-3 @5xl/adverts:grid-cols-4 gap-4"
						>
							{#each advertisements as advertisement}
								<AdvertisementItem {advertisement} />
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
	{#if $advertsQuery.isPending || $advertsQuery.isFetching}
		<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
	{:else if $advertsQuery.isError}
		<article>
			Error loading adverts: {$advertsQuery.error}
		</article>
	{/if}
</div>
