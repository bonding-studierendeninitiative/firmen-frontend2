<script lang="ts">
	import { getHumanReadableFileSize } from '@/utils/index.js';
	import { Button } from '@/components/ui/button/index.js';
	import { DocumentIcon } from '@/@svelte/icons/index.js';
	import { LocalizedDate } from '@/@svelte/components/index.js';
	import { page } from '$app/stores';
	import { trpc } from '@/trpc/client';
	import type { InferOutput } from 'valibot';
	import type { Export } from '@schema';
	import { Image } from 'lucide-svelte';
	import { _ } from '@services';

	const download = trpc($page).admin.export.generateDownloadLink.createMutation();
	export let _export: InferOutput<Export>;

	function handleDownload() {
		$download.mutate({
			eventId: _export.event.id,
			exportId: _export.id
		}, {
			onSuccess: (url) => {
				const a = document.createElement('a');
				a.href = url;
				a.download = url.split('/').pop();
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
			}
		});
	}
</script>

<div class="flex justify-between p-6 border-b border-gray-200">
	{#if _export.type === "ADVERT"}
		<DocumentIcon />
	{:else if _export.type === "LOGO"}
		<Image />
	{/if}
	{#if _export.size}
		<p>{getHumanReadableFileSize(_export.size)}</p>
	{/if}
	{#if _export.files}
		<p>{_export.files} Dateien</p>
	{/if}
	<LocalizedDate date={_export.createdAt} />
	<Button disabled={$download.isPending} on:click={handleDownload}>{$_("common.download")}
	</Button>
</div>