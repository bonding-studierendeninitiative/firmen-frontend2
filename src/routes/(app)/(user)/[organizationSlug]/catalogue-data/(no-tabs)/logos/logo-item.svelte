<script lang="ts">
	import * as Card from '@/components/ui/card';
	import { StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { SimpleDocumentOutput } from '@api/client';
	import { generateThumbnailLink as getThumbnail } from '@/remote/functions';
	import { LoaderCircle } from '@lucide/svelte';

	interface Props {
		logo: SimpleDocumentOutput;
		class?: string;
	}

	let { logo, class: className = '' }: Props = $props();

	let thumbnailFilter = $derived({
		documentId: logo.id ?? '',
		resolution: 'small' as const
	});
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
				class="aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden relative"
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
		</Card.Header>
		<Card.Content class="p-4 pt-0">
			<div class="flex justify-between items-center gap-2 @container">
				<h3 title={logo.title} class="font-semibold text-lg truncate">{logo.title}</h3>
				<!--<StatusBadge variant={logo.activeVersion?.uploadStatus} label={$_('status-text.' + logo.activeVersion?.uploadStatus)} />-->
			</div>
		</Card.Content>
	</Card.Root>
</section>
