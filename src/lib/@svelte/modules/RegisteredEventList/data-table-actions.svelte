<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import { _ } from '@services';
	import { UploadCatalogueData } from '@/@svelte/modules';

	export let id: string;
	let isUploadCatalogueDataOpen = false;
</script>

<UploadCatalogueData {id} bind:isOpen={isUploadCatalogueDataOpen} />

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">{$_("common.open-menu")}</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>{$_("user-pages.dashboard.data-table.actions.actions")}</DropdownMenu.Label>
			<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				{$_("user-pages.dashboard.data-table.actions.copy-id")}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (isUploadCatalogueDataOpen = true)}>
			{$_("user-pages.dashboard.data-table.actions.upload-catalogue-data")}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
