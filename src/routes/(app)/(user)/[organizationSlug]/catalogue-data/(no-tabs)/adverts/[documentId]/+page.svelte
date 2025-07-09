<script lang="ts">
	import { _ } from '@services';
	import {
		DeleteAdvertisementDialog,
		FileHistory,
		FileInformation
	} from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { LoaderCircle } from '@lucide/svelte';
	import * as Breadcrumb from '@/components/ui/breadcrumb';

	let { data } = $props();

	let advert = $derived(data.document);

	const download = $derived(
		trpc(page).catalogueData.generateDownloadLink.createQuery(
			{
				documentId: advert.id,
				organizationId: advert.organizationId
			},
			{
				staleTime: 15 * 60 * 1000
			}
		)
	);

	const thumbnail = $derived(
		trpc(page).catalogueData.generateThumbnailLink.createQuery(
			{
				documentId: advert.id,
				organizationId: advert.organizationId,
				resolution: 'large'
			},
			{
				enabled: advert.activeVersion?.uploadStatus === 'COMPLETED',
				staleTime: 60 * 60 * 1000,
				refetchOnWindowFocus: false
			}
		)
	);

	async function handleDownload() {
		const url = $download.data;
		if (url && url.length > 0) {
			const a = document.createElement('a');
			a.href = url;
			a.target = '_blank';
			a.download = url.split('/').pop();
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}
</script>

<Breadcrumb.Root class="pt-4">
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href={`.`}>
				{$_('user-pages.catalogue-data.base')}
			</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Link href={`.`}>
				{$_('user-pages.catalogue-data.adverts')}
			</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>{advert?.title}</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
{#if advert}
	<div class="grid grid-cols-2 gap-8 py-8 @container">
		<div
			class="-aspect-video col-span-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden p-4 @xl:col-span-1"
		>
			{#if $thumbnail.isLoading}
				<LoaderCircle class="mx-auto animate-spin size-8" />
			{:else if $thumbnail.data}
				<img
					src={$thumbnail.data || '/placeholder.svg'}
					alt={advert.title}
					class="object-contain size-full"
				/>
			{/if}
		</div>

		<div class="col-span-2 @xl:col-span-1 grid grid-cols-2 gap-8 text-sm auto-rows-min @container">
			<header class="flex flex-col justify-between col-span-2 @md:flex-row gap-4">
				<h2 class="text-2xl font-semibold text-slate-800">🖼️ {advert.title}</h2>
				<nav class="inline-flex gap-4">
					<Button variant="secondary" onclick={handleDownload}>{$_('common.download')}</Button>
					<DeleteAdvertisementDialog advertisement={advert} />
				</nav>
			</header>
			<FileHistory class="col-span-2 @md:col-span-1" history={advert.activeVersion?.history ?? []} />

			<FileInformation class="col-span-2 @md:col-span-1" documentVersion={advert.activeVersion} />
		</div>
	</div>
	<footer></footer>
{/if}
