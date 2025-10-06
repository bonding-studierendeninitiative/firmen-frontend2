<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { _ } from '@services';
	import RemoveMemberDialog from './remove-member-dialog.svelte';
	import { Link } from '@/@svelte/components';
	interface Props {
		id: string;
		userId: string;
		onRemoveMember?: (memberId: string, sendNotification: boolean) => void;
	}

	let { id, userId, onRemoveMember }: Props = $props();
	let open = $state(false);
</script>

<RemoveMemberDialog id={userId} bind:open {onRemoveMember} />

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" {...props} size="icon" class="relative size-8 p-0">
				<span class="sr-only">{$_('common.open-menu')}</span>
				<Ellipsis class="size-4" />
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
			<DropdownMenu.Separator />
			<Link
				class="text-secondary-foreground hover:no-underline hover:text-primary-foreground"
				href={`/admin/users/${userId}`}
			>
				<DropdownMenu.Item
					class="text-secondary-foreground hover:no-underline hover:text-primary-foreground"
				>
					{$_('admin-pages.organizations.data-table.actions.view-details')}
				</DropdownMenu.Item>
			</Link>
		</DropdownMenu.Group>
	</DropdownMenu.Content>
</DropdownMenu.Root>
