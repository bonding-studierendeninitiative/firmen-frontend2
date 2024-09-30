<script lang="ts">
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	const orgTypes = [
		{ label: 'Gemeinnützig', value: 'nonprofit', checked: false },
		{ label: 'Unternehmen', value: 'company', checked: false },
		{ label: 'Organisation', value: 'other', checked: false }
	];

	let open = false;
	export let value = '';

	$: selectedValue =
		orgTypes.find((f) => f.value === value)?.label ?? 'Select a org type...';
</script>

<DropdownMenu.Root bind:open closeOnItemClick={false}>
	<DropdownMenu.Trigger asChild let:builder>
		<Button
			builders={[builder]}
			variant="outline"
			role="combobox"
			aria-expanded={open}
			class="w-[300px] justify-between"
		>
			{selectedValue}
			<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content class="w-[300px]">
		<DropdownMenu.Label>Organization types</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.CheckboxItem onCheckedChange={(a) => {if (a) {
			orgTypes.forEach((_type) => _type.checked = false)
		}}}>All types
		</DropdownMenu.CheckboxItem>
		<DropdownMenu.Separator />
		{#each orgTypes as _type}
			<DropdownMenu.CheckboxItem bind:checked={_type.checked}>{_type.label}</DropdownMenu.CheckboxItem>
		{/each}
		<DropdownMenu.Separator />
			<Button variant="ghost">Close</Button>
	</DropdownMenu.Content>
</DropdownMenu.Root>