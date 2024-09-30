<script lang="ts">
	import { _ } from '@services/i18n.js';
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/form';

	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { TrashIcon } from '@/@svelte/icons';
	import { LoaderCircle } from 'lucide-svelte';

	let isOpen = false;

	let sending = false;

	const updateSending = () => {
		sending = true;
		return ({ update }) => {
			// Set invalidateAll to false if you don't want to reload page data when submitting
			update({ invalidateAll: true })
				.finally(async () => {
					sending = false;
				});
		};
	};
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Overlay />
	<Dialog.Trigger asChild>
		<Button class="aspect-square w-10 h-10 p-2 flex-shrink-0 justify-center text-red-500 hover:text-red-700"
						variant="ghost" disabled={$page.params.buyOptionId == null} on:click={() => isOpen = true}>
			<TrashIcon classes="w-6 h-6" />
		</Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Buy Option</Dialog.Title>
			<Dialog.Description>
				Do you really want to delete this buy option?
			</Dialog.Description>
		</Dialog.Header>
		<form class="flex flex-col gap-y-4" method="post" action="?/deleteBuyOption" use:enhance={updateSending}>

			<!--<Field form={superform} name="description">
				<Control let:attrs>
					<Label>Buy option description</Label>
					<Input {...attrs} bind:value={$formData.description} />
				</Control>
				<Description />
				<FieldErrors />
			</Field> -->

			<Dialog.Footer>
				<Button variant="secondary"
								on:click={(e) =>{ e.preventDefault(); return isOpen = false; }}>{$_('common.cancel')}</Button>
				<Button variant="destructive" type="submit">
					{#if sending }
						<LoaderCircle class="h-4 w-4 animate-spin" />
					{:else}
						{$_('common.delete')}
					{/if}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>