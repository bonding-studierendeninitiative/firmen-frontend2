<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';

	export let isOpen = false;
</script>

<Dialog.Root bind:open={isOpen}>

	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Submit Portrait</Dialog.Title>
			<Dialog.Description>Submit your portrait for review</Dialog.Description>
		</Dialog.Header>
	</Dialog.Content>
</Dialog.Root>