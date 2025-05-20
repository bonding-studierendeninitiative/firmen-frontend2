<script lang="ts">
	import * as Card from '@/components/ui/card';
	import { PdfFilePreview, StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import { ViewAdvertisementDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import type { AdvertisementOutput } from '@api/client';


	export let advertisement: AdvertisementOutput;
	let className = '';
	export { className as class };

	let showDialog = false;
</script>

<section>
	<Card.Root
		class={cn("bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300", className)}>
		<Card.Header class="p-4">
			<div
				class="[aspect-ratio:1/_1.41] bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center gap-2 overflow-hidden relative">
				<div class="absolute inset-0 flex items-center transition-opacity duration-300 justify-center opacity-0 hover:opacity-100 focus-within:opacity-100 bg-gray-900/60">
					<Button variant="outline" on:click={() => showDialog = true}>{$_("common.view-details")}</Button>
				</div>
				<PdfFilePreview url={`${advertisement.url}#toolbar=0&navpanes=0&scrollbar=0`} />
			</div>
		</Card.Header>
		<Card.Content class="p-4 pt-0">
			<div class="flex justify-between items-start @container">
				<Card.Title title={advertisement.title} class="font-semibold text-lg truncate">{advertisement.title}</Card.Title>
				<StatusBadge variant={advertisement.status} label={$_("status-text."+advertisement.status)} />
			</div>
		</Card.Content>
	</Card.Root>
</section>
<ViewAdvertisementDialog bind:open={showDialog} {advertisement} />