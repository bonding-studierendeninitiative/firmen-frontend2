<script lang="ts">
	import { StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn, getHumanReadableFileSize } from '@/utils';
	import type { LogoOutput } from '@api/client';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';
	import LocalizedDate from '../LocalizedDate/LocalizedDate.svelte';
	import { Button } from '@/components/ui/button';
	import { Replace } from 'lucide-svelte';

	interface Props {
		logo: LogoOutput;
		class?: string;
		pickNewLogo: () => void
	}

	let { logo, class: className = '', pickNewLogo }: Props = $props();

	const logoQuery = trpc(page).catalogueData.getDocumentVersionDescription.createQuery({
		documentId: logo.documentId,
		versionId: logo.versionId
	});

	const logoData = $derived($logoQuery.data);

	const thumbnail = trpc(page).catalogueData.generateThumbnailLink.createQuery(
		{
			documentId: logo.documentId,
			resolution: 'small'
		},
		{
			enabled: logo.status !== 'missing'
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
				alt={logo.status}
				class="object-contain w-full h-full"
			/>
		</div>
	{/if}

	<div class="">
		{#if logoData}
			<p class="font-medium text-md pb-1">{logoData.title}</p>
			<p class="text-xs text-muted-foreground whitespace-nowrap">
				{$_('file-types.' + (logoData.version?.contentType ?? 'unknown'))} · {getHumanReadableFileSize(
					Number(logoData.version?.size)
				)}
			</p>
			<p class="text-xs text-muted-foreground">
				Zuletzt bearbeitet: <LocalizedDate date={logoData.version?.modifiedAt} />
			</p>
		{/if}

		<div class="pt-4 w-full @container">
			<StatusBadge variant={logo.status} label={$_('status-text.' + logo.status)} />
		</div>

		<Button on:click={() => {
pickNewLogo()
		}} variant="ghost" class="text-blue-700 px-0"><Replace class="w-4 h-4 mr-2" />Logo ändern</Button>
	</div>
</section>
