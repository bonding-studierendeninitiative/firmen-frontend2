<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { Trash2 } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { _ } from '@services';
	import type { DetailedDocumentOutput } from '@api/client';

	interface Props {
		advertisement: DetailedDocumentOutput;
		onDelete: (id: string) => Promise<void>;
	}

	let { advertisement, onDelete }: Props = $props();
	let open = $state(false);
	let loading = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'destructive', size: 'icon' })}>
		<Trash2 class="size-5" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title
				>{$_('modules.delete-advertisement-dialog.title', {
					values: {
						advertisementName: advertisement.title
					}
				})}</Dialog.Title
			>
			<Dialog.Description
				>{$_('modules.delete-advertisement-dialog.description')}</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer class="pt-6">
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}
				>{$_('common.cancel')}</Dialog.Close
			>
			<Button
				onclick={() => {
					loading = true;
					onDelete?.(advertisement.id!)
						.then(async () => {
							open = false;
						})
						.catch((e) => {
							console.error(e);
						})
						.finally(() => {
							loading = false;
						});
				}}
				variant="destructive"
				disabled={loading}
			>
				<Trash2 class="mr-2 size-5" />
				{$_('common.delete')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
