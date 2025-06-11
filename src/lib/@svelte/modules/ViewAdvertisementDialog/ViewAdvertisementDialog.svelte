<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { LocalizedDate, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { Badge } from '@/components/ui/badge';
	import { getHumanReadableFileSize } from '@/utils';
	import { DeleteAdvertisementDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';
	import type { DetailedDocumentOutput } from '@api/client';
	import { LoaderCircle } from 'lucide-svelte';
	export let open = false;
	export let advertisement: DetailedDocumentOutput;

	const download = trpc($page).catalogueData.generateDownloadLink.createQuery(
		{
			documentId: advertisement.id,
			organizationId: advertisement.organizationId
		},
		{
			enabled: advertisement.activeVersion?.uploadStatus !== 'PENDING_UPLOAD' && advertisement.activeVersion?.uploadStatus !== 'PENDING_METADATA'
		}
	);

	const thumbnail = trpc($page).catalogueData.generateThumbnailLink.createQuery(
		{
			documentId: advertisement.id,
			organizationId: advertisement.organizationId,
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
					<LoaderCircle class="mx-auto animate-spin w-8 h-8" />
				{:else if $thumbnail.data}
					<div
						class="[aspect-ratio:1/_1.41] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
					>
						<img
							src={$thumbnail.data || '/placeholder.svg'}
							alt={advertisement.title}
							class="object-contain w-full h-full"
						/>
					</div>
				{/if}

				<div class="flex flex-col gap-4 text-sm">
					<Dialog.Header class="space-y-4">
						<Dialog.Title>{advertisement.title}</Dialog.Title>
						<Dialog.Description class="@container">
							<StatusBadge
								variant={advertisement.activeVersion?.reviewStatus}
								label={$_('status-text.' + advertisement.activeVersion?.reviewStatus)}
							/>
							<StatusBadge
								variant={advertisement.activeVersion?.uploadStatus}
								label={$_('status-text.' + advertisement.activeVersion?.uploadStatus)}
							/>
						</Dialog.Description>
					</Dialog.Header>
					<div>
						<h4 class="font-semibold mb-2">
							{$_('modules.view-advertisement-dialog.file-information')}
						</h4>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.view-advertisement-dialog.file-type')}</span
								>
								<span
									>{$_(
										'file-types.' + (advertisement.activeVersion?.contentType ?? 'unknown')
									)}</span
								>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.view-advertisement-dialog.file-size')}</span
								>
								<span>{getHumanReadableFileSize(advertisement.activeVersion?.size ?? 0)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.view-advertisement-dialog.file-created')}</span
								>
								<LocalizedDate date={advertisement.activeVersion?.createdAt} />
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.view-advertisement-dialog.file-modified')}</span
								>
								<LocalizedDate date={advertisement.activeVersion?.modifiedAt} />
							</div>
						</div>
					</div>
					<div>
						<h4 class="font-semibold mb-2">
							{$_('modules.view-advertisement-dialog.status-history')}
						</h4>
						<div class="space-y-3">
							{#each advertisement.activeVersion?.history ?? [] as history}
								<div
									class="border-l-2 pl-3"
									class:border-yellow-500={history.feedbackType === 'change-request'}
									class:border-green-500={history.feedbackType === 'confirmation'}
									class:border-red-500={history.feedbackType === 'rejection'}
								>
									<div class="flex items-center">
										<Badge>{history.feedbackType}</Badge>
									</div>
									{#if history.message}
										<p class="text-xs mt-1 text-gray-600 dark:text-gray-400">{history.message}</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>
					<div class="flex-grow"></div>
					<Dialog.Footer>
						<Button disabled={$download.isPending} on:click={handleDownload}
							>{$_('common.download')}
						</Button>
						<DeleteAdvertisementDialog {advertisement} />
					</Dialog.Footer>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
