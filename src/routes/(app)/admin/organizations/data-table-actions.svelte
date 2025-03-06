<script lang="ts">
	import {_} from "@services"
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Button } from '@/components/ui/button';

	export let id: string;
</script>

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">{$_("common.open-menu")}</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>{$_("admin-pages.organizations.data-table.actions.title")}</DropdownMenu.Label>
			<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				{$_("admin-pages.organizations.data-table.actions.copy-id")}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item href={`/admin/organizations/${id}`}>{$_("admin-pages.organizations.data-table.actions.view-details")}</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
