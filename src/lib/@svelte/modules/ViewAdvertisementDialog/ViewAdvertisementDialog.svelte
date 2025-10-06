<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { LocalizedDate, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { Badge } from '@/components/ui/badge';
	import { getHumanReadableFileSize } from '@/utils';
	import { DeleteAdvertisementDialog, FileInformation } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import type { DetailedDocumentOutput } from '@api/client';
	import { LoaderCircle } from '@lucide/svelte';
	import FileHistory from '../FileHistory/file-history.svelte';
	interface Props {
		open?: boolean;
		advertisement: DetailedDocumentOutput;
	}

	let { open = $bindable(false), advertisement }: Props = $props();

	const download = trpc(page).catalogueData.generateDownloadLink.createQuery(
		{
			documentId: advertisement.id ?? '',
			organizationId: advertisement.organizationId ?? ''
		},
		{
			enabled:
				advertisement.activeVersion?.uploadStatus !== 'PENDING_UPLOAD' &&
				advertisement.activeVersion?.uploadStatus !== 'PENDING_METADATA'
		}
	);

	const thumbnail = trpc(page).catalogueData.generateThumbnailLink.createQuery(
		{
			documentId: advertisement.id ?? '',
			organizationId: advertisement.organizationId ?? '',
			resolution: 'large'
		},
		{
			enabled: advertisement.activeVersion?.uploadStatus === 'COMPLETED'
		}
	);

	function handleDownload() {
		const downloadUrl = $download.data;
		if (downloadUrl && Number(downloadUrl?.length) > 0) {
			const a = document.createElement('a');
			a.href = downloadUrl;
			a.target = '_blank';
			a.download = downloadUrl.split('/').pop();
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
		{#if advertisement}
			<div class="grid grid-cols-2 gap-6">
				{#if $thumbnail.isLoading}
					<LoaderCircle class="mx-auto animate-spin size-8" />
				{:else if $thumbnail.data}
					<div
						class="aspect-[1/1.41] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
					>
						<img
							src={$thumbnail.data || '/placeholder.svg'}
							alt={advertisement.title}
							class="object-contain size-full"
						/>
					</div>
				{/if}

				<div class="flex flex-col gap-4 text-sm">
					<Dialog.Header class="space-y-4">
						<Dialog.Title>{advertisement.title}</Dialog.Title>
						<Dialog.Description class="@container"></Dialog.Description>
					</Dialog.Header>
					<FileInformation documentVersion={advertisement.activeVersion} />

					<FileHistory history={advertisement.activeVersion?.history ?? []} />

					<div class="grow"></div>
					<Dialog.Footer>
						<Button disabled={$download.isPending} onclick={handleDownload}
							>{$_('common.download')}
						</Button>
						<DeleteAdvertisementDialog {advertisement} />
					</Dialog.Footer>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
