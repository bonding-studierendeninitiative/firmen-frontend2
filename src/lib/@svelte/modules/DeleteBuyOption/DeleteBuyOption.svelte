<script lang="ts">
	import { _ } from '@services/i18n';
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/form';
	import { page } from '$app/state';
	import { TrashIcon } from '@/@svelte/icons';
	import { LoaderCircle } from '@lucide/svelte';
	import { buttonVariants } from '@/components/ui/button';

	let {
		onDelete
	}: {
		onDelete: () => Promise<void>;
	} = $props();

	let isOpen = $state(false);
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Overlay />
	<Dialog.Trigger
		disabled={!page.params.buyOptionId}
		class={[buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-red-500 hover:text-red-700']}
	>
		<TrashIcon class="size-6" />
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('modules.delete-buy-option.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.delete-buy-option.description')}</Dialog.Description>
		</Dialog.Header>
		<form class="flex flex-col gap-y-4">
			<!--<Field form={superform} name="description">
				<Control let:attrs>
					<Label>Buy option description</Label>
					<Input {...attrs} bind:value={$formData.description} />
				</Control>
				<Description />
				<FieldErrors />
			</Field> -->

			<Dialog.Footer>
				<Dialog.Close class={buttonVariants({ variant: 'secondary' })}
					>{$_('common.cancel')}</Dialog.Close
				>
				<Button
					disabled={!!$effect.pending()}
					variant="destructive"
					onclick={async () => {
						try {
							await onDelete();
							isOpen = false;
						} catch (e) {
							console.error(e);
						}
					}}
				>
					{#if $effect.pending()}
						<LoaderCircle class="size-4 animate-spin" />
					{:else}
						{$_('common.delete')}
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
