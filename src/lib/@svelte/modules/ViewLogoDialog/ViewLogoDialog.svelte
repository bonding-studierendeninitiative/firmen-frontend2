<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import type { InferOutput } from 'valibot';
	import type { LogoSchema } from '@schema';
	import { LocalizedDate, PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { getHumanReadableFileSize } from '@/utils';
	import { Badge } from '@/components/ui/badge';
	import { DeleteLogoDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';

	export let open = false;
	export let logo: InferOutput<LogoSchema>;

	const download = trpc($page).catalogueData.logos.generateDownloadLink.createMutation();

	function handleDownload() {
		$download.mutate({
			organizationId: logo.id,
			logoId: logo.id
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
<Dialog.Root bind:open>
	<Dialog.Content class="sm:max-w-4xl">
		{#if logo}
			<Dialog.Header>
				<Dialog.Title>{logo.title}</Dialog.Title>
				<Dialog.Description class="@container">
					<StatusBadge variant={logo.status} label={$_("status-text."+logo.status)} />
				</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-6 py-4">
				<div
					class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden">
					{#if logo.mimeType.startsWith("image/")}
						<img src={logo.url || "/placeholder.svg"} alt={logo.title} class="object-contain w-full h-full" />
					{:else}
						<PdfFilePreview url={`${logo.url}#toolbar=0&navpanes=0&scrollbar=0`} />
					{/if}
				</div>

				<div class="grid grid-cols-2 gap-4 text-sm">
					<div>
						<h4 class="font-semibold mb-2">{$_("modules.view-advertisement-dialog.file-information")}</h4>
						<div class="space-y-2">
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">{$_("modules.view-advertisement-dialog.file-type")}</span>
								<span>{$_("file-types." + (logo.mimeType ?? "unknown"))}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">{$_("modules.view-advertisement-dialog.file-size")}</span>
								<span>{getHumanReadableFileSize(logo.size ?? 0)}</span>
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">{$_("modules.view-advertisement-dialog.file-created")}</span>
								<LocalizedDate date={logo.createdAt} />
							</div>
							<div class="flex justify-between">
								<span class="text-gray-600 dark:text-gray-400">{$_("modules.view-advertisement-dialog.file-modified")}</span>
								<LocalizedDate date={logo.modifiedAt} />
							</div>
						</div>
					</div>

					<div>
						<h4 class="font-semibold mb-2">{$_("modules.view-advertisement-dialog.status-history")}</h4>
						<div class="space-y-3">
							{#each logo.history ?? [] as history}
								<div class="border-l-2 pl-3" class:border-yellow-500={history.feedbackType === 'change-request'}
										 class:border-green-500={history.feedbackType === 'confirmation'}
										 class:border-red-500={history.feedbackType === 'rejection'}>
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
				</div>
			</div>
			<Dialog.Footer>
				<Button disabled={$download.isPending} on:click={handleDownload}>{$_("common.download")}
				</Button>
				<DeleteLogoDialog {logo} />
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>