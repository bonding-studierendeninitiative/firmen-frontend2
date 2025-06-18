<script lang="ts">
	import { StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn, getHumanReadableFileSize } from '@/utils';
	import type { AdvertisementOutput } from '@api/client';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';
	import LocalizedDate from '../LocalizedDate/LocalizedDate.svelte';
	import { Button } from '@/components/ui/button';
	import { Replace } from 'lucide-svelte';

	interface Props {
		advert: AdvertisementOutput;
		class?: string;
		pickNewAdvertisement: () => void
	}

	let { advert, class: className = '', pickNewAdvertisement }: Props = $props();

	const advertQuery = trpc(page).catalogueData.getDocumentVersionDescription.createQuery({
		documentId: advert.documentId,
		versionId: advert.versionId,
	});

	const advertData = $derived($advertQuery.data);

	const thumbnail = trpc(page).catalogueData.generateThumbnailLink.createQuery(
		{
			documentId: advert.documentId,
			resolution: 'small'
		},
		{
			enabled: advert.status !== 'missing'
		}
	);
</script>

<section
	class={cn(
		'p-4 flex flex-row gap-4 w-full bg-muted rounded-xl border border-slate-300',
		className
	)}
>
	{#if Number($thumbnail.data?.length) > 0}
		<div
			class="aspect-video bg-white dark:bg-gray-700 rounded-md flex items-center justify-center overflow-hidden shrink-0"
		>
			<img
				src={$thumbnail.data || '/placeholder.svg'}
				alt={advert.status}
				class="object-contain w-full h-full"
			/>
		</div>
	{/if}

	<div class="">
		{#if advertData}
			<p class="font-medium text-md pb-1">{advertData.title}</p>
			<p class="text-xs text-muted-foreground whitespace-nowrap">
				{$_('file-types.' + (advertData.version?.contentType ?? 'unknown'))} · {getHumanReadableFileSize(
					Number(advertData.version?.size)
				)}
			</p>
			<p class="text-xs text-muted-foreground">
				Zuletzt bearbeitet: <LocalizedDate date={advertData.version?.modifiedAt} />
			</p>
		{/if}

		<div class="pt-4 w-full @container">
			<StatusBadge variant={advert.status} label={$_('status-text.' + advert.status)} />
		</div>

		<Button onclick={() => {
pickNewAdvertisement()
		}} variant="ghost" class="text-blue-700 px-0"><Replace class="w-4 h-4 mr-2" />Image-Anzeige ändern</Button>
	</div>
</section>
