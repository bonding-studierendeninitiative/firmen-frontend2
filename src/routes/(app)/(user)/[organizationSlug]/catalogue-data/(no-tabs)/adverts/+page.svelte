<script lang="ts">
	import { LinkTabs, NoDataFound } from '@/@svelte/components';
	import { dayjs } from '@services/i18n';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { UploadAdvertisementDialog } from '@/@svelte/modules/UploadAdvertisementDialog';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { _ } from '@services';
	import AdvertItem from './advert-item.svelte';

	let { data } = $props();
	let isUploadOpen = $state(false);

	let tabs = $derived([
		{
			name: 'catalogue-data-portraits',
			href: `/${data.orgSlug}/catalogue-data/portraits`
		},
		{
			name: 'catalogue-data-logos',
			href: `/${data.orgSlug}/catalogue-data/logos`
		},
		{
			name: 'catalogue-data-adverts',
			href: `/${data.orgSlug}/catalogue-data/adverts`
		}
	]);

	const api = trpc(page);
	const utils = api.createUtils();

	const [advertsQuery, resolveAdverts] = api.catalogueData.getAll.createInfiniteQuery(
		{ limit: '10', documentType: 'advert' },
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
<div class="size-full flex flex-col justify-start items-stretch min-h-max">
	<h1 class=" text-stone-950 text-3xl font-extrabold">{$_('user-pages.portraits.portraits')}</h1>
	<h4 class=" text-stone-500">{$_('user-pages.portraits.portraitsSubHeading')}</h4>
	<section class="grow">
		<div class=" my-6">
			<LinkTabs {tabs} />
		</div>
<div in:fade class="space-y-4">
	<div class="flex justify-end">
		{#if $uploadFormQuery.isLoading}
			<Button class="min-w-32 mr-2" disabled>
				<LoaderCircle class="size-5 mx-auto animate-spin" />
			</Button>
		{:else if $uploadFormQuery.data}
			<UploadAdvertisementDialog
				bind:open={isUploadOpen}
				advertisementUploadForm={$uploadFormQuery.data}
			/>
		{/if}
	</div>
	{#await resolveAdverts(data.advertisementData)}
		<LoaderCircle class="size-10 mx-auto animate-spin" />
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
						const year = dayjs(advertisement.activeVersion?.createdAt).year();

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
								<AdvertItem advert={advertisement} />
							{/each}
						</div>
					</div>
				{/each}
			{/if}
		{/if}
		{#if $advertsQuery.isLoading || $advertsQuery.isFetching}
			<LoaderCircle class="size-10 mx-auto animate-spin" />
		{:else if $advertsQuery.isError}
			<article>
				Error loading adverts: {$advertsQuery.error}
			</article>
		{/if}
	{:catch error}
		<p>{error.message}</p>
	{/await}
</div>
</section>
</div>
