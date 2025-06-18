<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { _ } from '@services';
	import RemoveMemberDialog from './remove-member-dialog.svelte';
	import AddMemberDialog from './add-member-dialog.svelte';
	interface Props {
		id: string;
		orgId: string;
	}

	let { id, orgId }: Props = $props();
	let open = $state(false);
	let isAddOpen = false;
</script>

<RemoveMemberDialog {orgId} {id} bind:open />

<DropdownMenu.Root>
	<DropdownMenu.Trigger >
		{#snippet child({ props })}
				<Button variant="ghost" {...props} size="icon" class="relative h-8 w-8 p-0">
				<span class="sr-only">{$_('common.open-menu')}</span>
				<Ellipsis class="h-4 w-4" />
			</Button>
					{/snippet}
		</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Item
				class="text-red-500 hover:text-red-700"
				onclick={() => {
					open = true;
				}}>{$_('common.remove')}</DropdownMenu.Item
			>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
