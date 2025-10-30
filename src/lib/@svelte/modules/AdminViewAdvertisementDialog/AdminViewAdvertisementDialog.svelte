<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { AdvertStatusIcon, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import {
		DeleteAdvertisementDialog,
		FileHistory,
		FileInformation,
		ReviewRegistrationDocumentDialog
	} from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import {
		generateDocumentDownloadLink as getDownload,
		generateThumbnailLink as getThumbnail
	} from '@/remote/functions/admin';
	import type { AdminRegistrationDocumentOutput } from '@api/admin-client';

	interface Props {
		advertisement: AdminRegistrationDocumentOutput;
	}

	let { advertisement }: Props = $props();

	const download = getDownload({
		documentId: advertisement.documentVersion?.document?.id!,
		organizationId: advertisement.documentVersion?.document?.organizationId!
	});

	function handleDownload() {
		const url = download.current;
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

	const thumbnail = getThumbnail({
		organizationId: advertisement?.documentVersion?.document?.organizationId ?? '',
		documentId: advertisement?.documentVersion?.document?.id ?? '',
		resolution: 'large'
	});
</script>

<Dialog.Root>
	{#if advertisement}
		<Dialog.Trigger>
			<AdvertStatusIcon
				title={$_('status-text.' + advertisement.status)}
				variant={advertisement.status ?? 'missing'}
			/>
		</Dialog.Trigger>
	{:else}
		<AdvertStatusIcon title={$_('status-text.missing')} variant={'missing'} />
	{/if}
	<Dialog.Content class="sm:max-w-4xl max-h-[80vh] overflow-y-auto">
		{#if advertisement}
			<div class="grid grid-cols-2 gap-6">
				<div
					class="aspect-[1/1.41] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
				>
					{#if thumbnail.current}
						<img
							src={thumbnail.current || '/placeholder.svg'}
							alt={advertisement?.documentVersion?.document?.title}
							class="object-contain size-full"
						/>
					{/if}
				</div>

				<div class="flex flex-col gap-4 text-sm">
					<Dialog.Header class="space-y-4">
						<Dialog.Title>{advertisement?.documentVersion?.document?.title}</Dialog.Title>
						<Dialog.Description class="@container">
							<StatusBadge
								variant={advertisement.status}
								label={$_('status-text.' + advertisement.status)}
							/>
						</Dialog.Description>
					</Dialog.Header>
					<FileInformation documentVersion={advertisement.documentVersion} />
					<FileHistory history={advertisement.documentVersion?.history ?? []} />
					<div class="grow"></div>
					<Dialog.Footer class="flex justify-end">
						<ReviewRegistrationDocumentDialog document={advertisement} />
						<Button disabled={download.loading} onclick={handleDownload}
							>{$_('common.download')}
						</Button>
						<DeleteAdvertisementDialog {advertisement} onDelete={async () => {}} />
					</Dialog.Footer>
				</div>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>
