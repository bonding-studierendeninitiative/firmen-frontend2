<script lang="ts">
	import { _ } from '@services';
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Button } from '@/components/ui/button';
	import { Link } from '@/@svelte/components';

	interface Props {
		id: string;
	}

	let { id }: Props = $props();
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button variant="ghost" {...props} size="icon" class="relative size-6 p-0">
				<span class="sr-only">{$_('common.open-menu')}</span>
				<Ellipsis class="size-4" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label
				>{$_('admin-pages.organizations.data-table.actions.title')}</DropdownMenu.Label
			>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
				{$_('admin-pages.organizations.data-table.actions.copy-id')}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item>
			<Link href={`/admin/organizations/${id}`}>
				{$_('admin-pages.organizations.data-table.actions.view-details')}
			</Link>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
