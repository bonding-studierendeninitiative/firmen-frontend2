<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { LocalizedDate, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { Badge } from '@/components/ui/badge';
	import { getHumanReadableFileSize } from '@/utils';
	import { DeleteAdvertisementDialog, FileInformation } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import {
		generateDownloadLink as getDownload,
		generateThumbnailLink as getThumbnail
	} from '@/remote/functions';
	import type { DetailedDocumentOutput } from '@api/client';
	import { LoaderCircle } from '@lucide/svelte';
	import FileHistory from '../FileHistory/file-history.svelte';
	interface Props {
		open?: boolean;
		advertisement: DetailedDocumentOutput;
	}

	let { open = $bindable(false), advertisement }: Props = $props();

	const download = getDownload({
		documentId: advertisement.id ?? '',
		organizationId: advertisement.organizationId ?? ''
	});

	const thumbnail = getThumbnail({ documentId: advertisement.id ?? '', resolution: 'large' });

	function handleDownload() {
		const downloadUrl = download.current;
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
				{#if thumbnail.loading}
					<LoaderCircle class="mx-auto animate-spin size-8" />
				{:else if thumbnail.current}
					<div
						class="aspect-[1/1.41] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
					>
						<img
							src={thumbnail.current || '/placeholder.svg'}
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
						<Button onclick={handleDownload}>{$_('common.download')}</Button>
						<DeleteAdvertisementDialog {advertisement} />
					</Dialog.Footer>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
