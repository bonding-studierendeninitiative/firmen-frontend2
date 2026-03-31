<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { DeleteLogoDialog, FileHistory, FileInformation } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import {
		generateDownloadLink as getDownload,
		generateThumbnailLink as getThumbnail
	} from '@/remote/functions';
	import { DocumentOutput_DetailedDocument_or_SimpleDocumentVersion } from '@api/client';
	import { LoaderCircle } from '@lucide/svelte';

	interface Props {
		open?: boolean;
		logo: DocumentOutput_DetailedDocument_or_SimpleDocumentVersion;
	}

	let { open = $bindable(false), logo }: Props = $props();

	const download = getDownload({ documentId: logo.id, organizationId: logo.organizationId });

	const thumbnail = getThumbnail({ documentId: logo.id, resolution: 'large' });

	async function handleDownload() {
		const url = await download;
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
		{#if logo.activeVersion}
			<Dialog.Header>
				<Dialog.Title>{logo.title}</Dialog.Title>
				<Dialog.Description class="@container">
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
					{#if thumbnail.loading}
						<LoaderCircle class="mx-auto animate-spin size-8" />
					{:else if thumbnail.current}
						<img
							src={thumbnail.current || '/placeholder.svg'}
							alt={logo.title}
							class="object-contain size-full"
						/>
					{/if}
				</div>

				<div class="grid grid-cols-2 gap-8 text-sm">
					{#if logo?.activeVersion}
						<FileInformation documentVersion={logo?.activeVersion} />
					{/if}

					<FileHistory history={logo.activeVersion?.history ?? []} />
				</div>
			</div>
			<Dialog.Footer>
				<Button onclick={handleDownload}>{$_('common.download')}</Button>
				<DeleteLogoDialog {logo} />
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
