<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { LocalizedDate, LogoStatusIcon, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { getHumanReadableFileSize } from '@/utils';
	import {
		DeleteLogoDialog,
		FileInformation,
		ReviewRegistrationDocumentDialog
	} from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import { generateThumbnailLink as getThumbnail } from '@/remote/functions/admin';
	import type { RegistrationDocumentOutput } from '@api/client';
	import { FileHistory } from '@/@svelte/modules';

	interface Props {
		logo: Partial<RegistrationDocumentOutput>;
	}

	let { logo }: Props = $props();

	import { generateDownloadLink as getDownload } from '@/remote/functions/admin';
	const download = getDownload({
		documentId: logo?.documentVersion?.document?.id ?? '',
		organizationId: logo?.documentVersion?.document?.organizationId ?? ''
	});

	const thumbnail = getThumbnail({
		documentId: logo?.documentVersion?.document?.id ?? '',
		organizationId: logo?.documentVersion?.document?.organizationId ?? '',
		resolution: 'large'
	});

	function handleDownload() {
		const url = download.current;
		if (url) {
			const a = document.createElement('a');
			a.href = url;
			a.target = '_blank';
			a.download = url.split('/').pop() ?? '';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
		}
	}
</script>

<Dialog.Root>
	{#if logo?.documentVersion}
		<Dialog.Trigger class="cursor-pointer">
			<LogoStatusIcon
				title={$_('status-text.' + logo.status)}
				variant={{ variant: logo.status ?? 'missing' }}
			/>
		</Dialog.Trigger>
	{:else}
		<LogoStatusIcon title={$_('status-text.missing')} variant={{ variant: 'missing' }} />
	{/if}
	<Dialog.Content class="sm:max-w-4xl">
		{#if logo.documentVersion}
			<Dialog.Header>
				<Dialog.Title>{logo?.documentVersion?.document?.title}</Dialog.Title>
				<Dialog.Description class="@container">
					<StatusBadge
						variant={logo.status ?? 'missing'}
						label={$_('status-text.' + logo.status)}
					/>
				</Dialog.Description>
			</Dialog.Header>

			<div class="grid gap-6 py-4">
				<div
					class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden"
				>
					{#if thumbnail.current}
						<img
							src={thumbnail.current || '/placeholder.svg'}
							alt={logo?.documentVersion?.document?.title}
							class="object-contain size-full"
						/>
					{/if}
				</div>

				<div class="grid grid-cols-2 gap-4 text-sm">
					<FileInformation documentVersion={logo?.documentVersion} />

					<FileHistory history={logo?.documentVersion?.history ?? []} />
				</div>
			</div>
			<Dialog.Footer class="flex justify-end">
				<ReviewRegistrationDocumentDialog document={logo} />
				<Button onclick={handleDownload}>{$_('common.download')}</Button>
				<DeleteLogoDialog {logo} />
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
