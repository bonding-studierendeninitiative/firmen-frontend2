<script lang="ts">
	import { LinkTabs, NoDataFound } from '@/@svelte/components';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { UploadLogoDialog } from '@/@svelte/modules';
	import { _, dayjs } from '@services/i18n';
	import LogoItem from './logo-item.svelte';
	import * as Pagination from '$lib/components/ui/pagination';
	import { getCatalogueByType as getAllCatalogueData } from '@/remote/functions/catalogueData.remote';

	let { params } = $props();

	let isUploadOpen = $state(false);

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
	const logos = $derived(
		getAllCatalogueData({
			limit: String(pageSize),
			cursor: String(currentPage - 1),
			documentType: 'logo'
		})
	);
	const allLogos = $derived.by(() => {
		return logos.current?.documents ?? [];
	});

	const totalElements = $derived.by(() => logos.current?.totalElements ?? 0);

	const groupedLogos = $derived.by(() => {
		return allLogos.reduce((acc, logo) => {
			const year = dayjs(logo?.activeVersion?.createdAt).year();

			if (!acc[year]) {
				acc[year] = [];
			}
			acc[year].push(logo);
			return acc;
		}, {});
	});

	const onSuccess = () => {
		logos.refresh();
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
				<UploadLogoDialog bind:open={isUploadOpen} {onSuccess} />
			</div>
			{#if logos.loading}
				<LoaderCircle class="size-10 mx-auto animate-spin" />
			{:else if logos.ready}
				{#if allLogos}
					{#if allLogos.length < 1}
						<NoDataFound
							heading={$_('user-pages.catalogue-data.logos-data.no-data-heading')}
							subHeading={$_('user-pages.catalogue-data.logos-data.no-data-subheading')}
							buttonText={$_('user-pages.catalogue-data.logos-data.no-data-action')}
							onButtonClick={() => {
								isUploadOpen = true;
							}}
						/>
					{:else}
						<div in:fade class="space-y-8">
							{#each Object.entries(groupedLogos || {}).sort( ([ayear, alogos], [byear, blogos]) => byear.localeCompare(ayear) ) as [year, logos] (year)}
								<div class="space-y-4 py-2 @container/logos">
									<h2 class="text-xl font-bold border-b">{year}</h2>
									<div
										class="grid grid-cols-1 @lg/logos:grid-cols-2 @3xl/logos:grid-cols-3 @5xl/logos:grid-cols-4 gap-6"
									>
										{#each logos as logo (logo.id)}
											<LogoItem {logo} />
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
			{/if}
		</div>
	</section>
</div>
