<script lang="ts">
	import * as Card from '@/components/ui/card';
	import { PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import { ViewAdvertisementDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import type { DetailedDocumentOutput } from '@api/client';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';

	export let advertisement: DetailedDocumentOutput;
	let className = '';
	export { className as class };

	const download = trpc($page).catalogueData.generateDownloadLink.createQuery({
		documentId: advertisement.id,
		organizationId: advertisement.organizationId
	});

	let showDialog = false;
</script>

<section>
	<Card.Root
		class={cn(
			'bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300',
			className
		)}
	>
		<Card.Header class="p-4">
			<div
				class="[aspect-ratio:1/_1.41] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center gap-2 overflow-hidden relative"
			>
				<div
					class="absolute inset-0 flex items-center transition-opacity duration-300 justify-center opacity-0 hover:opacity-100 focus-within:opacity-100 bg-gray-900/60"
				>
					<Button variant="outline" on:click={() => (showDialog = true)}
						>{$_('common.view-details')}</Button
					>
				</div>
				{#if $download.data && Number($download.data?.length) > 0}
					<PdfFilePreview url={`${$download.data}#toolbar=0&navpanes=0&scrollbar=0`} />
				{/if}
			</div>
		</Card.Header>
		<Card.Content class="p-4 pt-0">
			<div class="flex justify-between items-start @container">
				<Card.Title title={advertisement.title} class="font-semibold text-lg truncate"
					>{advertisement.title}</Card.Title
				>
				<StatusBadge
					variant={advertisement.activeVersion?.reviewStatus}
					label={$_('status-text.' + advertisement.activeVersion?.reviewStatus)}
				/>
			</div>
		</Card.Content>
	</Card.Root>
</section>
<ViewAdvertisementDialog bind:open={showDialog} {advertisement} />
