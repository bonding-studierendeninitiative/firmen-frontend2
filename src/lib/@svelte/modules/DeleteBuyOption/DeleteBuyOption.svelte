<script lang="ts">
	import { _ } from '@services/i18n.js';
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/form';

	import { page } from '$app/stores';
	import { TrashIcon } from '@/@svelte/icons';

	let isOpen = false;
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Overlay />
	<Dialog.Trigger asChild>
		<Button class="aspect-square w-10 h-10 p-2 flex-shrink-0 justify-center" variant="destructive" disabled={$page.params.buyOptionId == null} on:click={() => (isOpen = true)}><TrashIcon classes="w-6 h-6" /></Button>
	</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Delete Buy Option</Dialog.Title>
			<Dialog.Description>
				Do you really want to delete this buy option?
			</Dialog.Description>
		</Dialog.Header>
		<form class="flex flex-col gap-y-4" method="post" action="?/deleteBuyOption">

			<!--<Field form={superform} name="description">
				<Control let:attrs>
					<Label>Buy option description</Label>
					<Input {...attrs} bind:value={$formData.description} />
				</Control>
				<Description />
				<FieldErrors />
			</Field> -->

			<Dialog.Footer>
				<Button variant="secondary" on:click={() => (isOpen = false)}>{$_('common.cancel')}</Button>
				<Button variant="destructive" type="submit">{$_('common.delete')}</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>