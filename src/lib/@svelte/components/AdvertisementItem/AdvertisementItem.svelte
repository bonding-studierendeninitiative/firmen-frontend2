<script lang="ts">
	import * as Card from '@/components/ui/card';
	import { StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn } from '@/utils';
	import { ViewAdvertisementDialog } from '@/@svelte/modules';
	import { Button } from '@/components/ui/button';
	import type { DetailedDocumentOutput } from '@api/client';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { LoaderCircle } from 'lucide-svelte';
	interface Props {
		advertisement: DetailedDocumentOutput;
		class?: string;
	}

	let { advertisement, class: className = '' }: Props = $props();
	

	const thumbnail = trpc(page).catalogueData.generateThumbnailLink.createQuery(
		{
			documentId: advertisement.id,
			organizationId: advertisement.organizationId,
			resolution: 'medium'
		},
		{
			enabled: advertisement.activeVersion?.uploadStatus === 'COMPLETED'
		}
	);

	let showDialog = $state(false);
</script>

<section class="w-full">
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
					<Button variant="outline" onclick={() => (showDialog = true)}
						>{$_('common.view-details')}</Button
					>
				</div>
				{#if advertisement.activeVersion?.uploadStatus === 'UPLOADED' || $thumbnail.isLoading}
					<LoaderCircle class="mx-auto animate-spin w-5" />
				{:else if $thumbnail.data}
					<img
						src={$thumbnail.data || '/placeholder.svg'}
						alt={advertisement.title}
						class="object-contain w-full h-full"
					/>
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
