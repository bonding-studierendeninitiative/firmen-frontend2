<script lang="ts">
	import * as Item from '@/components/ui/item';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { DocumentOutput_DetailedDocument_or_SimpleDocumentVersion } from '@api/client';
	import { generateThumbnailLink as getThumbnail } from '@/remote/functions';
	import { LoaderCircle } from '@lucide/svelte';

	interface Props {
		logo: DocumentOutput_DetailedDocument_or_SimpleDocumentVersion;
		class?: string;
	}

	let { logo, class: className = '' }: Props = $props();

	let thumbnailFilter = $derived({
		documentId: logo.id ?? '',
		resolution: 'small' as const
	});
</script>

<section>
	<Item.Root variant="outline" class={cn(className)}>
		<Item.Header>
			<div
				class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden relative grow"
			>
				<div
					class="absolute inset-0 flex items-center transition-opacity duration-300 justify-center opacity-0 hover:opacity-100 bg-gray-900/60"
				>
					<Button variant="outline" href={'./logos/' + logo.id}>{$_('common.view-details')}</Button>
				</div>
				{#if logo.activeVersion?.uploadStatus === 'UPLOADED' || getThumbnail(thumbnailFilter).loading}
					<LoaderCircle class="mx-auto animate-spin w-5" />
				{:else if getThumbnail(thumbnailFilter).current}
					<img
						src={getThumbnail(thumbnailFilter).current || '/placeholder.svg'}
						alt={logo.title}
						class="object-contain size-full"
					/>
				{/if}
			</div>
		</Item.Header>
		<Item.Content>
			<Item.Title title={logo.title} class="truncate">{logo.title}</Item.Title>
			<!--<StatusBadge variant={logo.activeVersion?.uploadStatus} label={$_('status-text.' + logo.activeVersion?.uploadStatus)} />-->
		</Item.Content>
	</Item.Root>
</section>
