<script lang="ts">
	import { LocalizedDate, PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { getHumanReadableFileSize } from '@/utils';
	import { Badge } from '@/components/ui/badge';
	import { DeleteLogoDialog, FileHistory, FileInformation } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { LoaderCircle } from '@lucide/svelte';
	import * as Breadcrumb from '@/components/ui/breadcrumb';

	let { data } = $props();

	let logo = $derived(data.document);

	const download = $derived(
		trpc(page).catalogueData.generateDownloadLink.createQuery(
			{
				documentId: logo.id,
				organizationId: logo.organizationId
			},
			{
				staleTime: 15 * 60 * 1000
			}
		)
	);

	const thumbnail = $derived(
		trpc(page).catalogueData.generateThumbnailLink.createQuery(
			{
				documentId: logo.id,
				organizationId: logo.organizationId,
				resolution: 'large'
			},
			{
				enabled: logo.activeVersion?.uploadStatus === 'COMPLETED',
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

<Breadcrumb.Root>
	<Breadcrumb.List>
		<Breadcrumb.Item>
			<Breadcrumb.Link href={`.`}>
				{$_('user-pages.catalogue-data.logos')}
			</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>{logo?.title}</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
{#if logo}
	<div class="grid gap-6 py-4">
		<header class="pt-4 flex justify-between">
			<h2 class="text-2xl font-semibold text-slate-800">🖼️ {logo.title}</h2>
			<nav class="inline-flex gap-4">
				<Button onclick={handleDownload}>{$_('common.download')}</Button>
				<DeleteLogoDialog {logo} />
			</nav>
		</header>
		<div
			class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
		>
			{#if $thumbnail.isLoading}
				<LoaderCircle class="mx-auto animate-spin size-8" />
			{:else if $thumbnail.data}
				<img
					src={$thumbnail.data || '/placeholder.svg'}
					alt={logo.title}
					class="object-contain size-full"
				/>
			{/if}
		</div>

		<div class="grid grid-cols-2 gap-8 text-sm">
			<FileHistory history={logo.activeVersion?.history ?? []} />

			<FileInformation documentVersion={logo.activeVersion} />
		</div>
	</div>
	<footer></footer>
{/if}
