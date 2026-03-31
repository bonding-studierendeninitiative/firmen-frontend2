<script lang="ts">
	import { Link } from '@/@svelte/components';
	import * as Item from '@/components/ui/item';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { FileText, LoaderCircle, PenLine, Trash2 } from '@lucide/svelte';
	import * as Dialog from '@/components/ui/dialog';
	import { _ } from '@services';
	import type { GetPortraitTemplateSchema } from '@/remote/functions';
	import { cn } from '@/utils';

	interface Props {
		portrait: GetPortraitTemplateSchema;
		onDelete?: ({ portraitTemplateId }: { portraitTemplateId: string }) => Promise<void>;
	}

	let { portrait, onDelete }: Props = $props();

	let open = $state(false);
	let pending = $state(false);
</script>

<Item.Root variant="outline">
	<Item.Media variant="icon">
		<FileText />
	</Item.Media>
	<Item.Content>
		<Item.Title>{portrait.title}</Item.Title>
	</Item.Content>
	<Item.Actions>
		<Link data-sveltekit-replacestate href={`portraits/${portrait.id}`}
			><PenLine class="size-4" /></Link
		>
		<Dialog.Root bind:open>
			<Dialog.Trigger
				class={cn(
					buttonVariants({ variant: 'ghost', size: 'icon' }),
					'p-0 max-w-6 max-h-6 cursor-pointer text-muted-foreground hover:bg-destructive hover:text-destructive-foreground '
				)}
				type="button"
			>
				<Trash2 class="size-3.5" />
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Title>{$_('user-pages.portraits.deletePortrait')}</Dialog.Title>
				<Dialog.Description>
					<p>{$_('user-pages.portraits.deletePortraitDescription')}</p>
					<p class="mt-2 font-medium">{$_('user-pages.portraits.nameOfPortrait')}:</p>
					<p>{portrait.title}</p>
				</Dialog.Description>
				<Dialog.Footer class="flex justify-end items-center w-full">
					{#if pending}
						<Button form={`delete-portrait-form-${portrait.id}`} disabled variant="destructive">
							<LoaderCircle class="mr-2 size-4 animate-spin" />{$_('common.delete')}
						</Button>
					{:else}
						<Button
							onclick={async () => {
								try {
									pending = true;
									await onDelete?.({ portraitTemplateId: portrait.id! });
									open = false;
								} catch (error) {
									console.error('Error in onDelete callback:', error);
								} finally {
									pending = false;
								}
							}}
							variant="destructive">{$_('common.delete')}</Button
						>
					{/if}
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</Item.Actions>
</Item.Root>
