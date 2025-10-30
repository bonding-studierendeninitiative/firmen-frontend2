<script lang="ts">
	import { _ } from '@services';
	import { DeleteAdvertisementDialog, FileHistory, FileInformation } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import {
		deleteDocument,
		getDocument,
		generateDownloadLink as getDownload,
		generateThumbnailLink as getThumbnail
	} from '@/remote/functions';
	import { LoaderCircle } from '@lucide/svelte';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import { goto } from '$app/navigation';
	import { toast } from 'svelte-sonner';

	let { params } = $props();

	let advertisementFilter = $derived({
		documentId: params.documentId
	});

	let thumbnailFilter = $derived({
		documentId: params.documentId,
		resolution: 'large' as const
	});

	let downloadFilter = $derived.by(() => {
		if (!getDocument(advertisementFilter).ready) return null;
		else {
			return {
				documentId: params.documentId,
				organizationId: getDocument(advertisementFilter).current?.organizationId!
			};
		}
	});

	async function handleDownload() {
		if (downloadFilter == null) return;
		const url = await getDownload(downloadFilter);
		if (url && url.length > 0) {
			const a = document.createElement('a');
			a.href = url;
			a.target = '_blank';
			a.download = url.split('/').pop()!;
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
			<Breadcrumb.Page>{getDocument(advertisementFilter).current?.title}</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
{#if getDocument(advertisementFilter).ready}
	<div class="grid grid-cols-2 gap-8 py-8 @container">
		<div
			class="-aspect-video col-span-2 bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden p-4 @xl:col-span-1"
		>
			{#if getThumbnail(thumbnailFilter).loading}
				<LoaderCircle class="mx-auto animate-spin size-8" />
			{:else if getThumbnail(thumbnailFilter).ready}
				<img
					src={getThumbnail(thumbnailFilter).current || '/placeholder.svg'}
					alt={getDocument(advertisementFilter).current?.title}
					class="object-contain size-full"
				/>
			{/if}
		</div>

		<div class="col-span-2 @xl:col-span-1 grid grid-cols-2 gap-8 text-sm auto-rows-min @container">
			<header class="flex flex-col justify-between col-span-2 @md:flex-row gap-4">
				<h2 class="text-2xl font-semibold text-slate-800">
					🖼️ {getDocument(advertisementFilter).current?.title}
				</h2>
				<nav class="inline-flex gap-4">
					<Button variant="secondary" onclick={handleDownload}>{$_('common.download')}</Button>
					<DeleteAdvertisementDialog
						advertisement={getDocument(advertisementFilter).current!}
						onDelete={async (id) => {
							try {
								await deleteDocument({ documentId: id }).updates(getDocument(advertisementFilter));
								await goto(`/${params.organizationSlug}/catalogue-data/adverts`);
								toast.success($_('modules.delete-advertisement-dialog.success'));
							} catch (error) {
								toast.error($_('user-pages.catalogue-data.advertisements.delete-error'));
								throw error;
							}
						}}
					/>
				</nav>
			</header>
			<FileHistory
				class="col-span-2 @md:col-span-1"
				history={getDocument(advertisementFilter).current?.activeVersion?.history ?? []}
			/>

			<FileInformation
				class="col-span-2 @md:col-span-1"
				documentVersion={getDocument(advertisementFilter).current?.activeVersion!}
			/>
		</div>
	</div>
	<footer></footer>
{/if}
