<script lang="ts">
	import { LinkTabs, NoDataFound } from '@/@svelte/components';
	import { LoaderCircle, Plus } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { UploadLogoDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { _, dayjs } from '@services/i18n';
	import LogoItem from './logo-item.svelte';
	let isUploadOpen = $state(false);

	import {
		getCatalogueByType as getAllCatalogueData,
		uploadForm as getCatalogueUploadForm
	} from '@/remote/functions/catalogueData.remote';
	import { page } from '$app/state';

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

	const logos = getAllCatalogueData({ limit: '10', documentType: 'logo' });

	const allLogos = $derived.by(() => {
		return logos.current?.documents ?? [];
	});

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
					<UploadLogoDialog
						bind:open={isUploadOpen}
						logoUploadForm={uploadFormQuery.current!}
						onUpload={async ({ submit, form, data }) => {
							try {
								await submit().updates(logos);
							} catch (error) {
								console.error('Error uploading logo:', error);
							}
						}}
					/>
				{/if}
			</div>
			{#if logos.loading}
				<LoaderCircle class="size-10 mx-auto animate-spin" />
			{:else if logos.ready}
				{#if allLogos}
					{#if allLogos.length < 1}
						<NoDataFound
							heading="No logos found"
							subHeading="You can add logos to your organization"
							buttonText="Add logo"
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
						</div>
					{/if}
				{/if}
			{/if}
		</div>
	</section>
</div>
