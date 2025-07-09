<script lang="ts">
	import { Button } from '@/components/ui/button';
	import { cn } from '@/utils';
	import { FileWarning } from '@lucide/svelte';
	import { _ } from '@services';

	interface Props {
		class?: string;
		documentType: 'logo' | 'advert' | 'portrait';
		pickNewDocument: () => void;
	}

	let { class: className = '', pickNewDocument, documentType }: Props = $props();
</script>

<section
	class={cn(
		'p-4 flex flex-col items-center gap-4 w-full bg-muted rounded-xl border border-border',
		className
	)}
>
	<div class="rounded-full p-4 aspect-square text-accent-foreground bg-accent">
		<FileWarning class="size-7" />
	</div>

	<div class="space-y-1 text-center">
		<h4 class="font-medium text-lg">
			{$_(`components.registration-document-missing.${documentType}.title`)}
		</h4>

		<p class="text-sm text-balance">
			{$_(`components.registration-document-missing.${documentType}.description`)}
		</p>
	</div>

	<Button
		onclick={() => {
			pickNewDocument();
		}}
		variant="default"
		size="sm"
		>{$_('components.registration-document-missing.actions.pick-document.' + documentType)}</Button
	>
</section>
