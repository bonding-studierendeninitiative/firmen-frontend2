<script lang="ts">
	import { StatusBadge } from '@/@svelte/components';
	import { _ } from '@services';
	import { cn, getHumanReadableFileSize } from '@/utils';
	import type { AdminRegistrationDocumentOutput } from '@api/admin-client';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';
	import LocalizedDate from '../LocalizedDate/LocalizedDate.svelte';

	interface Props {
		registrationDocument: AdminRegistrationDocumentOutput;
		class?: string;
	}

	let { registrationDocument, class: className = '' }: Props = $props();

	const thumbnail = trpc(page).catalogueData.generateThumbnailLink.createQuery(
		{
			documentId: registrationDocument?.documentVersion?.document?.id ?? '',
			resolution: 'small'
		},
		{
			enabled: registrationDocument?.documentVersion?.uploadStatus === "COMPLETED"
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
				alt={registrationDocument.status}
				class="object-contain size-full"
			/>
		</div>
	{/if}

	<div class="">
		{#if registrationDocument?.documentVersion}
			<p class="font-medium text-md pb-1">{registrationDocument?.documentVersion?.document?.title}</p>
			<p class="text-xs text-muted-foreground whitespace-nowrap">
				{$_('file-types.' + (registrationDocument.documentVersion.contentType ?? 'unknown'))} · {getHumanReadableFileSize(
					Number(registrationDocument.documentVersion.size)
				)}
			</p>
			<p class="text-xs text-muted-foreground">
				Zuletzt bearbeitet: <LocalizedDate date={registrationDocument.documentVersion.modifiedAt} />
			</p>
		{/if}

		<div class="pt-4 w-full @container">
			<StatusBadge variant={registrationDocument?.status} label={$_('status-text.' + registrationDocument?.status)} />
		</div>
	</div>
</section>
