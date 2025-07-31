<script lang="ts">
	import { getHumanReadableFileSize } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { DocumentIcon } from '@/@svelte/icons';
	import { LocalizedDate } from '@/@svelte/components';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';
	import { Image } from '@lucide/svelte';
	import { _ } from '@services';
	import type { ExportForEventOutput } from '@api/admin-client';

	const download = trpc(page).admin.export.generateDownloadLink.createMutation();
	interface Props {
		_export: ExportForEventOutput;
		eventId: string;
	}

	let { _export, eventId }: Props = $props();

	function handleDownload() {
		$download.mutate(
			{
				eventId,
				exportId: _export.id
			},
			{
				onSuccess: (result) => {
					const url = result;
					if (url) {
						const a = document.createElement('a');
						a.href = url;
						a.download = url.split('/').pop();
						document.body.appendChild(a);
						a.click();
						document.body.removeChild(a);
					}
				}
			}
		);
	}
</script>

<div class="flex justify-between p-6 border-b border-gray-200">
	{#if _export.type === 'advert'}
		<DocumentIcon />
	{:else if _export.type === 'logo'}
		<Image />
	{/if}
	{#if _export.size}
		<p>{getHumanReadableFileSize(_export.size)}</p>
	{/if}
	{#if _export.files}
		<p>{ $_('components.export-item.entries', {values: {entries: _export.files}}) }</p>
	{/if}
	<LocalizedDate date={_export.createdAt} />
	<Button disabled={$download.isPending} onclick={handleDownload}>{$_('common.download')}</Button>
</div>
