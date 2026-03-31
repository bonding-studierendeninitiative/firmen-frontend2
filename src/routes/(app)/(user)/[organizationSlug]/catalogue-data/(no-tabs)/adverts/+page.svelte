<script lang="ts">
	import { LinkTabs, NoDataFound } from '@/@svelte/components';
	import { dayjs } from '@services/i18n';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { UploadAdvertisementDialog } from '@/@svelte/modules/UploadAdvertisementDialog';
	import { _ } from '@services';
	import AdvertItem from './advert-item.svelte';
	import { getCatalogueByType as getAllCatalogueData } from '@/remote/functions/catalogueData.remote';
	import * as Pagination from '$lib/components/ui/pagination';

	let isUploadOpen = $state(false);

	let { params } = $props();

	let tabs = $derived([
		{
			name: 'catalogue-data-portraits',
			href: `/${params.organizationSlug!}/catalogue-data/portraits`
		},
		{
			name: 'catalogue-data-logos',
			href: `/${params.organizationSlug!}/catalogue-data/logos`
		},
		{
			name: 'catalogue-data-adverts',
			href: `/${params.organizationSlug!}/catalogue-data/adverts`
		}
	]);

	const pageSize = 8;
	let currentPage = $state(1);

	// Use $derived instead of calling the function directly
	// This will automatically refresh when currentPage changes
	const advertsQuery = $derived(
		getAllCatalogueData({
			limit: String(pageSize),
			cursor: String(currentPage - 1),
			documentType: 'advert'
		})
	);

	const allAdverts = $derived.by(() => {
		return advertsQuery.current?.documents ?? [];
	});

	const totalElements = $derived.by(() => advertsQuery.current?.totalElements ?? 0);

	$inspect(advertsQuery);
	$inspect(totalElements);

	const groupedAdvertisements = $derived.by(() => {
		return allAdverts
			.filter((advert) => advert != undefined)
			.reduce((acc: Record<number, typeof allAdverts>, advertisement) => {
				const year = dayjs(advertisement.activeVersion?.createdAt).year();

				if (!acc[year]) {
					acc[year] = [];
				}
				acc[year].push(advertisement);
				return acc;
			}, {});
	});

	const onCreate = () => {
		advertsQuery.refresh();
	};
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
				<UploadAdvertisementDialog bind:open={isUploadOpen} onSuccess={onCreate} />
			</div>
			{#if advertsQuery.loading}
				<LoaderCircle class="size-10 mx-auto animate-spin" />
			{:else if advertsQuery.ready}
				{#if allAdverts}
					{#if allAdverts.length === 0}
						<NoDataFound
							heading={$_('user-pages.catalogue-data.adverts-data.no-data-heading')}
							subHeading={$_('user-pages.catalogue-data.adverts-data.no-data-subheading')}
							buttonText={$_('user-pages.catalogue-data.adverts-data.no-data-action')}
							onButtonClick={() => {
								isUploadOpen = true;
							}}
						/>
					{:else}
						<div in:fade class="space-y-8">
							{#each Object.entries(groupedAdvertisements).sort( ([ayear, aadverts], [byear, badverts]) => byear.localeCompare(ayear) ) as [year, advertisements] (year)}
								<div class="space-y-4 @container/adverts">
									<h2 class="text-xl font-bold border-b">{year}</h2>
									<div
										class="grid grid-cols-1 @lg:grid-cols-2 @3xl/adverts:grid-cols-3 @5xl/adverts:grid-cols-4 gap-4"
									>
										{#each advertisements as advertisement (advertisement.id)}
											<AdvertItem advert={advertisement} />
										{/each}
									</div>
								</div>
							{/each}
							<Pagination.Root count={totalElements} perPage={pageSize} bind:page={currentPage}>
								{#snippet children({ pages, currentPage })}
									<Pagination.Content>
										<Pagination.Item>
											<Pagination.PrevButton />
										</Pagination.Item>
										{#each pages as page (page.key)}
											{#if page.type === 'ellipsis'}
												<Pagination.Item>
													<Pagination.Ellipsis />
												</Pagination.Item>
											{:else}
												<Pagination.Item>
													<Pagination.Link
														{page}
														isActive={currentPage === page.value}
														class={currentPage === page.value ? 'border-1 border-stone-950' : ''}
													>
														{page.value}
													</Pagination.Link>
												</Pagination.Item>
											{/if}
										{/each}
										<Pagination.Item>
											<Pagination.NextButton />
										</Pagination.Item>
									</Pagination.Content>
								{/snippet}
							</Pagination.Root>
						</div>
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
