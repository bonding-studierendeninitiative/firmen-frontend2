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
		logo: RegistrationDocumentOutput;
		class?: string;
		pickNewLogo: () => void;
	}

	let { logo, class: className = '', pickNewLogo }: Props = $props();

	const thumbnail = trpc(page).catalogueData.generateThumbnailLink.createQuery(
		{
			documentId: logo.documentVersion?.document?.id ?? '',
			resolution: 'small'
		},
		{
			enabled: true
		}
	);
</script>

<section
	class={cn(
		'p-4 flex flex-row gap-4 w-full bg-muted rounded-xl border border-border',
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
				class="object-contain size-full"
			/>
		</div>
	{/if}

	<div class="space-y-4">
		{#if logo.documentVersion}
			<div>
				<p class="font-medium text-md pb-1">{logo.documentVersion.document?.title}</p>
				<p class="text-xs text-muted-foreground whitespace-nowrap">
					{$_('file-types.' + (logo.documentVersion.contentType ?? 'unknown'))} · {getHumanReadableFileSize(
						Number(logo.documentVersion.size)
					)}
				</p>
				<p class="text-xs text-muted-foreground">
					Zuletzt bearbeitet: <LocalizedDate date={logo.documentVersion.modifiedAt} />
				</p>
			</div>
		{/if}

		<div class="w-full @container">
			<StatusBadge variant={logo.status} label={$_('status-text.' + logo.status)} />
		</div>

		<Button
			onclick={() => {
				pickNewLogo();
			}}
			variant="ghost"
			size="sm"
			class="text-accent"><Replace class="size-4 mr-1" />Logo ändern</Button
		>
	</div>
</section>
