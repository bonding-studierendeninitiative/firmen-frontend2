<script lang="ts">
	import { LinkTabs, NoDataFound } from '@/@svelte/components';
	import { dayjs } from '@services/i18n';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { UploadAdvertisementDialog } from '@/@svelte/modules/UploadAdvertisementDialog';
	import { Button } from '@/components/ui/button';
	import { page } from '$app/state';
	import { _ } from '@services';
	import AdvertItem from './advert-item.svelte';

	let isUploadOpen = $state(false);

	let tabs = $derived([
		{
			name: 'catalogue-data-portraits',
			href: `/${page.params.organizationSlug!}/catalogue-data/portraits`
		},
		{
			name: 'catalogue-data-logos',
			href: `/${page.params.organizationSlug!}/catalogue-data/logos`
		},
		{
			name: 'catalogue-data-adverts',
			href: `/${page.params.organizationSlug!}/catalogue-data/adverts`
		}
	]);

	// TODO: Switch to remote function and page level callbacks instead of using data from the load function & trpc

	import {
		getCatalogueByType as getAllCatalogueData,
		uploadForm as getCatalogueUploadForm
	} from '@/remote/functions/catalogueData.remote';

	const advertsQuery = getAllCatalogueData({ limit: '10', documentType: 'advert' });
	const uploadFormQuery = getCatalogueUploadForm({});
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
				{#if uploadFormQuery.loading}
					<Button class="min-w-32 mr-2" disabled>
						<LoaderCircle class="size-5 mx-auto animate-spin" />
					</Button>
				{:else if uploadFormQuery.ready}
					<UploadAdvertisementDialog
						bind:open={isUploadOpen}
						advertisementUploadForm={uploadFormQuery.current}
					/>
				{/if}
			</div>
			{#if advertsQuery.loading}
				<LoaderCircle class="size-10 mx-auto animate-spin" />
			{:else if advertsQuery.ready}
				{#if advertsQuery?.current}
					{@const allAdverts = advertsQuery.current?.documents}
					{#if allAdverts?.length === 0}
						<NoDataFound
							heading="No advertisements found"
							subHeading="You can create one from the advertisements page"
							buttonText="Upload an advertisement"
							onButtonClick={() => {
								isUploadOpen = true;
							}}
						/>
					{:else}
						{@const groupedAdvertisements: Record<number, typeof allAdverts> = allAdverts
							?.filter((advert) => advert != undefined)
							.reduce((acc: Record<number, typeof allAdverts>, advertisement) => {
								const year = dayjs(advertisement.activeVersion?.createdAt).year();

								if (!acc[year]) {
									acc[year] = [];
								}
								acc[year].push(advertisement);
								return acc;
							}, {}) ?? {}}
						{#each Object.entries(groupedAdvertisements).sort( ([ayear, aadverts], [byear, badverts]) => byear.localeCompare(ayear) ) as [year, advertisements]}
							<div class="space-y-4 @container/adverts">
								<h2 class="text-xl font-bold border-b">{year}</h2>
								<div
									class="grid grid-cols-1 @lg:grid-cols-2 @3xl/adverts:grid-cols-3 @5xl/adverts:grid-cols-4 gap-4"
								>
									{#each advertisements ?? [] as advertisement}
										<AdvertItem advert={advertisement} />
									{/each}
								</div>
							</div>
						{/each}
					{/if}
				{/if}
				{#if advertsQuery.error}
					<article>
						Error loading adverts: {advertsQuery.error}
					</article>
				{/if}
			{/if}
		</div>
	</section>
</div>
