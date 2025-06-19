<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { LocalizedDate, PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { getHumanReadableFileSize } from '@/utils';
	import { Badge } from '@/components/ui/badge';
	import { DeleteLogoDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { DetailedDocumentOutput } from '@api/client';
	import { LoaderCircle } from '@lucide/svelte';

	interface Props {
		open?: boolean;
		logo: DetailedDocumentOutput;
	}

	let { open = $bindable(false), logo }: Props = $props();

	const download = trpc(page).catalogueData.generateDownloadLink.createQuery({
		documentId: logo.id,
		organizationId: logo.organizationId
	}, {
		staleTime: 15 * 60 * 1000
	});

	const thumbnail = trpc(page).catalogueData.generateThumbnailLink.createQuery(
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

<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-4xl">
		{#if logo}
			<Dialog.Header>
				<Dialog.Title>{logo.title}</Dialog.Title>
				<Dialog.Description class="@container">
					<StatusBadge
						variant={logo.activeVersion?.reviewStatus}
						label={$_('status-text.' + logo.activeVersion?.reviewStatus)}
					/>
					<StatusBadge
						variant={logo.activeVersion?.uploadStatus}
						label={$_('status-text.' + logo.activeVersion?.uploadStatus)}
					/>
				</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-6 py-4">
				<div
					class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
				>
					{#if $thumbnail.isLoading}
						<LoaderCircle class="mx-auto animate-spin size-8" />
					{:else if $thumbnail.data}
						{#if logo.activeVersion?.contentType?.startsWith('image/')}
							<img
								src={$thumbnail.data || '/placeholder.svg'}
								alt={logo.title}
								class="object-contain size-full"
							/>
						{:else}
							<PdfFilePreview url={`${$thumbnail.data}#toolbar=0&navpanes=0&scrollbar=0`} />
						{/if}
					{/if}
				</div>

				<div class="grid grid-cols-2 gap-8 text-sm">
					<div>
						<h4 class="font-semibold mb-2">
							{$_('modules.view-advertisement-dialog.file-information')}
						</h4>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.view-advertisement-dialog.file-type')}</span
								>
								<span>{$_('file-types.' + (logo.activeVersion?.contentType ?? 'unknown'))}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.view-advertisement-dialog.file-size')}</span
								>
								<span>{getHumanReadableFileSize(logo.activeVersion?.size ?? 0)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.view-advertisement-dialog.file-created')}</span
								>
								<LocalizedDate date={logo.activeVersion?.createdAt} />
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.view-advertisement-dialog.file-modified')}</span
								>
								<LocalizedDate date={logo.activeVersion?.modifiedAt} />
							</div>
						</div>
					</div>

					<div>
						<h4 class="font-semibold mb-2">
							{$_('modules.view-advertisement-dialog.status-history')}
						</h4>
						<div class="space-y-3">
							{#each logo.activeVersion?.history ?? [] as history}
								<div
									class="border-l-2 pl-3"
									class:border-yellow-500={history.feedbackType === 'change-request'}
									class:border-green-500={history.feedbackType === 'confirmation'}
									class:border-red-500={history.feedbackType === 'rejection'}
									class:border-blue-500={history.feedbackType === 'UPLOAD'}
								>
									<div class="flex items-center gap-x-2">
										<Badge>{$_("modules.view-logo-dialog.status."+history.feedbackType)}</Badge>
									</div>
									{#if history.message}
										<p class="text-xs mt-1 text-gray-600 dark:text-gray-400">{history.message}</p>
									{/if}
									<LocalizedDate date={history.timestamp} />
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
			<Dialog.Footer>
				<Button onclick={handleDownload}>{$_('common.download')}</Button>
				<DeleteLogoDialog {logo} />
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
