<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import type { InferOutput } from 'valibot';
	import type { AdvertisementSchema } from '@schema';
	import { AdvertStatusIcon, LocalizedDate, PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { Badge } from '@/components/ui/badge';
	import { getHumanReadableFileSize } from '@/utils';
	import { DeleteAdvertisementDialog, ReviewAdvertisementDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';

	export let advertisement: InferOutput<AdvertisementSchema>;

	const download = trpc($page).catalogueData.advertisements.generateDownloadLink.createMutation();

	function handleDownload() {
		$download.mutate({
			organizationId: advertisement.id,
			advertisementId: advertisement.id
		}, {
			onSuccess: (url) => {
				const a = document.createElement('a');
				a.href = url;
				a.target = '_blank';
				a.download = url.split('/').pop();
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}
		});
	}
</script>
<Dialog.Root>
	{#if advertisement}
		<Dialog.Trigger>
			<AdvertStatusIcon variant={advertisement?.status ?? "missing"} />
		</Dialog.Trigger>
	{:else }
		<AdvertStatusIcon title={$_("status-text.missing")} variant={"missing"} />
	{/if}
	<Dialog.Content class="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
		{#if advertisement}
			<div class="grid grid-cols-2 gap-6">
				<div
					class="[aspect-ratio:1/_1.41] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
					<PdfFilePreview url={`${advertisement.url}#toolbar=0&navpanes=0&scrollbar=0`} />
				</div>

				<div class="flex flex-col gap-4 text-sm">
					<Dialog.Header class="space-y-4">
						<Dialog.Title>{advertisement.title}</Dialog.Title>
						<Dialog.Description class="@container">
							<StatusBadge variant={advertisement.status} label={$_("status-text."+advertisement.status)} />
						</Dialog.Description>
					</Dialog.Header>
					<div>
						<h4 class="font-semibold mb-2">{$_("modules.admin-view-advertisement-dialog.file-information")}</h4>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span
									class="text-gray-600 dark:text-gray-400">{$_("modules.admin-view-advertisement-dialog.file-type")}</span>
								<span>{$_("file-types." + (advertisement.mimeType ?? "unknown"))}</span>
							</div>
							<div class="flex justify-between">
								<span
									class="text-gray-600 dark:text-gray-400">{$_("modules.admin-view-advertisement-dialog.file-size")}</span>
								<span>{getHumanReadableFileSize(advertisement.size ?? 0)}</span>
							</div>
							<div class="flex justify-between">
								<span
									class="text-gray-600 dark:text-gray-400">{$_("modules.admin-view-advertisement-dialog.file-created")}</span>
								<LocalizedDate date={advertisement.createdAt} />
							</div>
							<div class="flex justify-between">
								<span
									class="text-gray-600 dark:text-gray-400">{$_("modules.admin-view-advertisement-dialog.file-modified")}</span>
								<LocalizedDate date={advertisement.modifiedAt} />
							</div>
						</div>
					</div>
					<div>
						<h4 class="font-semibold mb-2">{$_("modules.admin-view-advertisement-dialog.status-history")}</h4>
						<div class="space-y-3">
							{#each advertisement.history ?? [] as history}
								<div class="border-l-2 pl-3" class:border-yellow-500={history.feedbackType === 'change-request'}
										 class:border-green-500={history.feedbackType === 'confirmation'}
										 class:border-red-500={history.feedbackType === 'rejection'}>
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
					<div class="flex-grow"></div>
					<Dialog.Footer class="flex justify-end">
						<ReviewAdvertisementDialog {advertisement} />
						<Button disabled={$download.isPending} on:click={handleDownload}>{$_("common.download")}
						</Button>
						<DeleteAdvertisementDialog {advertisement} />
					</Dialog.Footer>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>