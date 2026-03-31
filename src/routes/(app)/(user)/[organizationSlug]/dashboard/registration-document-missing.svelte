<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { FileWarning } from '@lucide/svelte';
	import * as Empty from '@/components/ui/empty';
	import { _ } from '@services';

	interface Props {
		class?: string;
		documentType: 'logo' | 'advert' | 'portrait';
		pickNewDocument: () => void;
	}

	let { class: className = '', pickNewDocument, documentType }: Props = $props();
</script>

<Empty.Root class={cn('bg-muted border border-dashed border-border', className)}>
	<Empty.Header>
		<Empty.Media variant="icon" class="text-accent-foreground bg-accent">
			<FileWarning class="size-7" />
		</Empty.Media>
		<Empty.Title>
			{$_(`components.registration-document-missing.${documentType}.title`)}
		</Empty.Title>

		<Empty.Description>
			{$_(`components.registration-document-missing.${documentType}.description`)}
		</Empty.Description>
	</Empty.Header>

	<Empty.Content>
		<Button
			onclick={() => {
				pickNewDocument();
			}}
			variant="default"
			size="sm"
			>{$_(
				'components.registration-document-missing.actions.pick-document.' + documentType
			)}</Button
		>
	</Empty.Content>
</Empty.Root>
