<script lang="ts">
	import * as Item from '@/components/ui/item';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { DocumentOutput_DetailedDocument_or_SimpleDocumentVersion } from '@api/client';
	import { generateThumbnailLink as getThumbnail } from '@/remote/functions';
	import { LoaderCircle } from '@lucide/svelte';

	interface Props {
		advert: DocumentOutput_DetailedDocument_or_SimpleDocumentVersion;
		class?: string;
	}

	let { advert, class: className = '' }: Props = $props();

	const thumbnail = getThumbnail({
		documentId: advert.id ?? '',
		resolution: 'medium'
	});
</script>

<section>
	<Item.Root variant="outline" class={cn(className)}>
		<Item.Header>
			<div
				class="-aspect-video bg-gray-100 dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden relative"
			>
				<div
					class="absolute inset-0 flex items-center transition-opacity duration-300 justify-center opacity-0 hover:opacity-100 bg-gray-900/60"
				>
					<Button variant="outline" href={'./adverts/' + advert.id}
						>{$_('common.view-details')}</Button
					>
				</div>
				{#if advert.activeVersion?.uploadStatus === 'UPLOADED' || thumbnail.loading}
					<LoaderCircle class="mx-auto animate-spin w-5" />
				{:else if thumbnail.current}
					<img
						src={thumbnail.current || '/placeholder.svg'}
						alt={advert.title}
						class="object-contain size-full"
					/>
				{/if}
			</div>
		</Item.Header>
		<Item.Content>
			<Item.Title title={advert.title}>{advert.title}</Item.Title>
			<!--<StatusBadge variant={advert.activeVersion?.uploadStatus} label={$_('status-text.' + advert.activeVersion?.uploadStatus)} />-->
		</Item.Content>
	</Item.Root>
</section>
