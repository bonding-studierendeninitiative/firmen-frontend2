<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { LocalizedDate, LogoStatusIcon, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { getHumanReadableFileSize } from '@/utils';
	import { Badge } from '@/components/ui/badge';
	import { DeleteLogoDialog, ReviewLogoDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import type { LogoOutput } from '@api/admin-client';

	interface Props {
		logo: LogoOutput;
	}

	let { logo }: Props = $props();

	const logoData = trpc(page).catalogueData.getDocument.createQuery({
		documentId: logo?.documentId
	}, {
		enabled: !!logo?.documentId
	});

	const download = trpc(page).catalogueData.generateDownloadLink.createQuery({
		documentId: logo?.documentId,
		organizationId: "random"
	}, {
		enabled: !!logo?.documentId
	});
	
	const thumbnail = trpc(page).catalogueData.generateThumbnailLink.createQuery({
		documentId: logo?.documentId,
		organizationId: "random",
		resolution: "large"
	}, {
		enabled: !!logo?.documentId
	});

	function handleDownload() {
		const url = $download.data
		if (url) {
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

<Dialog.Root>
	{#if logo}
		<Dialog.Trigger>
			<LogoStatusIcon variant={logo.status ?? 'missing'} />
		</Dialog.Trigger>
	{:else}
		<LogoStatusIcon title={$_('status-text.missing')} variant={'missing'} />
	{/if}
	<Dialog.Content class="sm:max-w-4xl">
		{#if $logoData.data}
			<Dialog.Header>
				<Dialog.Title>{$logoData.data.title}</Dialog.Title>
				<Dialog.Description class="@container">
					<StatusBadge variant={$logoData.data.activeVersion?.reviewStatus} label={$_('status-text.' + $logoData.data.activeVersion?.reviewStatus)} />
				</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-6 py-4">
				<div
					class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
				>
					{#if $thumbnail.data}
						<img
							src={$thumbnail.data || '/placeholder.svg'}
							alt={$logoData.data.title}
							class="object-contain w-full h-full"
						/>
					{/if}
				</div>

				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<h4 class="font-semibold mb-2">
							{$_('modules.admin-view-logo-dialog.file-information')}
						</h4>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.admin-view-logo-dialog.file-type')}</span
								>
								<span>{$_('file-types.' + ($logoData.data.activeVersion?.contentType ?? 'unknown'))}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.admin-view-logo-dialog.file-size')}</span
								>
								<span>{getHumanReadableFileSize($logoData.data.activeVersion?.size ?? 0)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.admin-view-logo-dialog.file-created')}</span
								>
								<LocalizedDate date={$logoData.data.activeVersion?.createdAt} />
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400"
									>{$_('modules.admin-view-logo-dialog.file-modified')}</span
								>
								<LocalizedDate date={$logoData.data.activeVersion?.modifiedAt} />
							</div>
						</div>
					</div>

					<div>
						<h4 class="font-semibold mb-2">
							{$_('modules.admin-view-logo-dialog.status-history')}
						</h4>
						<div class="space-y-3">
							{#each $logoData.data.activeVersion?.history ?? [] as history}
								<div
									class="border-l-2 pl-3"
									class:border-yellow-500={history.feedbackType === 'change-request'}
									class:border-green-500={history.feedbackType === 'confirmation'}
									class:border-red-500={history.feedbackType === 'rejection'}
								>
									<div class="flex items-center">
										<Badge>{$_(`common.catalogue-data-history.${history.feedbackType}`)}</Badge>
									</div>
									{#if history.message}
										<p class="text-xs mt-1 text-gray-600 dark:text-gray-400">{history.message}</p>
									{/if}
								</div>
							{/each}
						</div>
					</div>
				</div>
			</div>
			<Dialog.Footer class="flex justify-end">
				<ReviewLogoDialog {logo} />
				<Button disabled={$download.isPending} onclick={handleDownload}
					>{$_('common.download')}
				</Button>
				<DeleteLogoDialog {logo} />
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
