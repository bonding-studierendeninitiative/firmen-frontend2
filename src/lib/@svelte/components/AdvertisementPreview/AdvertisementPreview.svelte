<script lang="ts">
	import { StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn, getHumanReadableFileSize } from '@/utils';
	import type { RegistrationDocumentOutput } from '@api/client';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';
	import LocalizedDate from '../LocalizedDate/LocalizedDate.svelte';
	import { Button } from '@/components/ui/button';
	import { Replace } from '@lucide/svelte';

	interface Props {
		advert: RegistrationDocumentOutput;
		class?: string;
		pickNewAdvertisement: () => void
	}

	let { advert, class: className = '', pickNewAdvertisement }: Props = $props();

	const thumbnail = trpc(page).catalogueData.generateThumbnailLink.createQuery(
		{
			documentId: advert?.documentVersion?.document?.id ?? '',
			resolution: 'small'
		},
		{
			enabled: advert?.documentVersion?.uploadStatus === "COMPLETED"
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
				class="object-contain size-full"
			/>
		</div>
	{/if}

	<div class="">
		{#if advert?.documentVersion}
			<p class="font-medium text-md pb-1">{advert?.documentVersion?.document?.title}</p>
			<p class="text-xs text-muted-foreground whitespace-nowrap">
				{$_('file-types.' + (advert.documentVersion.contentType ?? 'unknown'))} · {getHumanReadableFileSize(
					Number(advert.documentVersion.size)
				)}
			</p>
			<p class="text-xs text-muted-foreground">
				Zuletzt bearbeitet: <LocalizedDate date={advert.documentVersion.modifiedAt} />
			</p>
		{/if}

		<div class="pt-4 w-full @container">
			<StatusBadge variant={advert?.status} label={$_('status-text.' + advert?.status)} />
		</div>

		<Button onclick={() => {
pickNewAdvertisement()
		}} variant="ghost" class="text-blue-700 px-0"><Replace class="size-4 mr-2" />Image-Anzeige ändern</Button>
	</div>
</section>
