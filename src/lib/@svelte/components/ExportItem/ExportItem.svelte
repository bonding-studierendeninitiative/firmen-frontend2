<script lang="ts">
	import { getHumanReadableFileSize } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { DocumentIcon } from '@/@svelte/icons';
	import { LocalizedDate } from '@/@svelte/components';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';
	import type { InferOutput } from 'valibot';
	import type { Export } from '@schema';
	import { Image } from 'lucide-svelte';
	import { _ } from '@services';

	const download = trpc(page).admin.export.generateDownloadLink.createMutation();
	interface Props {
		_export: InferOutput<Export>;
	}

	let { _export }: Props = $props();

	function handleDownload() {
		$download.mutate(
			{
				eventId: _export.event.id,
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
	{#if _export.type === 'ADVERT'}
		<DocumentIcon />
	{:else if _export.type === 'LOGO'}
		<Image />
	{/if}
	{#if _export.size}
		<p>{getHumanReadableFileSize(_export.size)}</p>
	{/if}
	{#if _export.files}
		<p>{_export.files} Dateien</p>
	{/if}
	<LocalizedDate date={_export.createdAt} />
	<Button disabled={$download.isPending} onclick={handleDownload}>{$_('common.download')}</Button>
</div>
