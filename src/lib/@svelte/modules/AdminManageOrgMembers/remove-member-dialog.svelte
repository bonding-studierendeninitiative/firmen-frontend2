<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { LoaderCircle, Trash2 } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { _ } from '@services';
	import { Switch } from '@/components/ui/switch';
	import { Label } from '@/components/ui/label';

	interface Props {
		id: string;
		open?: boolean;
		onRemoveMember?: (userId: string, sendNotification: boolean) => void;
	}

	let { id, open = $bindable(false), onRemoveMember }: Props = $props();

	let sendNotification = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('modules.remove-member-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.remove-member-dialog.description')}</Dialog.Description>
		</Dialog.Header>
		<div class="flex gap-3 items-center mt-6">
			<Switch id="sendNotification" bind:checked={sendNotification} />
			<Label for="sendNotification">Nutzer:in benachrichtigen</Label>
		</div>
		<Dialog.Footer class="pt-6">
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}
				>{$_('common.cancel')}</Dialog.Close
			>
			{#if $effect.pending()}
				<Button disabled variant="destructive">
					<Trash2 class="mr-2 size-5" />

					<LoaderCircle class="size-3 animate-spin mx-6" />
				</Button>
			{:else}
				<Button
					onclick={() => {
						onRemoveMember?.(id, sendNotification);
						open = false;
					}}
					variant="destructive"
				>
					<Trash2 class="mr-2 size-5" />
					{$_('common.delete')}
				</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
