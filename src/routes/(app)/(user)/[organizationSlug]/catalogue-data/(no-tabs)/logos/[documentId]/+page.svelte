<script lang="ts">
	import { _ } from '@services';
	import { DeleteLogoDialog, FileHistory, FileInformation } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import {
		deleteDocument,
		getDocument,
		generateDownloadLink as getDownload,
		generateThumbnailLink as getThumbnail
	} from '@/remote/functions';
	import { LoaderCircle } from '@lucide/svelte';
	import * as Breadcrumb from '@/components/ui/breadcrumb';
	import { page } from '$app/state';
	import { th } from '@faker-js/faker';
	import { toast } from 'svelte-sonner';
	import { goto } from '$app/navigation';

	let logoFilter = $derived({
		documentId: page.params.documentId!
	});

	let thumbnailFilter = $derived({
		documentId: page.params.documentId!,
		resolution: 'large' as const
	});

	let downloadFilter = $derived.by(() => {
		if (!getDocument(logoFilter).ready) return null;
		else {
			return {
				documentId: page.params.documentId!,
				organizationId: getDocument(logoFilter).current?.organizationId!
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
				{$_('user-pages.catalogue-data.logos')}
			</Breadcrumb.Link>
		</Breadcrumb.Item>
		<Breadcrumb.Separator />
		<Breadcrumb.Item>
			<Breadcrumb.Page>{getDocument(logoFilter).current?.title}</Breadcrumb.Page>
		</Breadcrumb.Item>
	</Breadcrumb.List>
</Breadcrumb.Root>
{#if getDocument(logoFilter).ready}
	<div class="grid gap-6 py-4 @container">
		<header class="pt-4 flex justify-between">
			<h2 class="text-2xl font-semibold text-slate-800">
				🖼️ {getDocument(logoFilter).current?.title}
			</h2>
			<nav class="inline-flex gap-4">
				<Button variant="secondary" onclick={handleDownload}>{$_('common.download')}</Button>
				<DeleteLogoDialog
					logo={getDocument(logoFilter).current!}
					onDelete={async (id) => {
						try {
							await deleteDocument({ documentId: id }).updates(getDocument(logoFilter));
							await goto(`/${page.params.organizationSlug}/catalogue-data/logos`);
							toast.success($_('modules.delete-logo-dialog.success'));
						} catch (error) {
							toast.error('Error deleting logo');
							throw error;
						}
					}}
				/>
			</nav>
		</header>
		<div
			class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
		>
			{#if getThumbnail(thumbnailFilter).loading}
				<LoaderCircle class="mx-auto animate-spin size-8" />
			{:else if getThumbnail(thumbnailFilter).ready}
				<img
					src={getThumbnail(thumbnailFilter).current || '/placeholder.svg'}
					alt={getDocument(logoFilter).current?.title}
					class="object-contain size-full"
				/>
			{/if}
		</div>

		<div class="grid grid-cols-1 gap-8 text-sm @md:grid-cols-2">
			<FileHistory history={getDocument(logoFilter).current?.activeVersion?.history ?? []} />

			<FileInformation documentVersion={getDocument(logoFilter).current?.activeVersion!} />
		</div>
	</div>
	<footer></footer>
{/if}
