<script lang="ts">
	import { page } from '$app/state';
	import { LocalizedDate, StatusBadge } from '@/@svelte/components';
	import { Button } from '@/components/ui/button';
	import { generateThumbnailLink as getThumbnail } from '@/remote/functions';
	import { cn, getHumanReadableFileSize } from '@/utils';
	import type { RegistrationDocumentOutput } from '@api/client';
	import { Replace } from '@lucide/svelte';
	import { _ } from '@services';
	import { tv } from 'tailwind-variants';
	import { Image } from '@unpic/svelte';
	import { Skeleton } from '@/components/ui/skeleton';

	interface Props {
		registrationDocument: RegistrationDocumentOutput;
		class?: string;
		pickNewDocument: () => void;
	}

	let { registrationDocument, class: className = '', pickNewDocument }: Props = $props();

	const thumbnail = getThumbnail({
		documentId: registrationDocument?.documentVersion?.document?.id ?? '',
		resolution: 'small'
	});

	const previewVariants = tv({
		variants: {
			documentType: {
				logo: 'aspect-video',
				advert: '-aspect-video',
				portrait: ''
			}
		}
	});
</script>

<section
	class={cn(
		'p-4 flex flex-col gap-4 w-full bg-muted rounded-xl border border-border @md/preview:flex-row',
		className
	)}
>
	{#if thumbnail.ready}
		<div
			class={cn(
				previewVariants({ documentType: registrationDocument.documentType }),
				' bg-white dark:bg-gray-700 rounded-md flex items-center justify-center shrink-0'
			)}
		>
			<Image
				src={thumbnail.current || '/placeholder.svg'}
				alt={registrationDocument.status}
				aspectRatio={16 / 9}
			/>
		</div>
	{:else}
		<Skeleton class="w-40 bg-white aspect-video"></Skeleton>
	{/if}

	<div class="space-y-4">
		{#if registrationDocument?.documentVersion}
			<div>
				<p class="font-medium text-md pb-1">
					{registrationDocument?.documentVersion?.document?.title}
				</p>
				<p class="text-xs text-muted-foreground whitespace-nowrap">
					{$_('file-types.' + (registrationDocument.documentVersion.contentType ?? 'unknown'))} · {getHumanReadableFileSize(
						Number(registrationDocument.documentVersion.size)
					)}
				</p>
				<p class="text-xs text-muted-foreground">
					{$_('components.registration-document-preview.last-edited')}<LocalizedDate
						date={registrationDocument.documentVersion.modifiedAt}
					/>
				</p>
			</div>
		{/if}

		<div class="w-full @container">
			<StatusBadge
				variant={registrationDocument?.status}
				label={$_('status-text.' + registrationDocument?.status)}
			/>
		</div>

		<Button
			onclick={() => {
				pickNewDocument();
			}}
			variant="ghost"
			size="sm"
			class="text-accent"
			><Replace class="size-4 mr-1" />{$_(
				'components.registration-document-preview.actions.replace-document.' +
					registrationDocument.documentType
			)}</Button
		>
	</div>
</section>
