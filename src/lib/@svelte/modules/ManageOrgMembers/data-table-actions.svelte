<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { _ } from '@services';
	import RemoveMemberDialog from './remove-member-dialog.svelte';
	import AddMemberDialog from './add-member-dialog.svelte';
	export let id: string;
	export let orgId: string;
	let open = false;
	let isAddOpen = false;
</script>

<RemoveMemberDialog {orgId} {id} bind:open />

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">{$_('common.open-menu')}</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item
				class="text-red-500 hover:text-red-700"
				on:click={() => {
					open = true;
				}}>{$_('common.remove')}</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
