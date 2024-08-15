<script lang="ts">
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	const packages = [
		{ label: 'Light', value: 'light', checked: false },
		{ label: 'Standard', value: 'standard', checked: false },
		{ label: 'Premium', value: 'premium', checked: false }
	];

	let open = false;
	let value = '';

	$: selectedValue =
		packages.find((f) => f.value === value)?.label ?? 'Select a package...';
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
		<DropdownMenu.Label>Packages</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.CheckboxItem onCheckedChange={(a) => {if (a) {
			packages.forEach((_package) => _package.checked = false)
		}}}>All packages
		</DropdownMenu.CheckboxItem>
		<DropdownMenu.Separator />
		{#each packages as _package}
			<DropdownMenu.CheckboxItem bind:checked={_package.checked}>{_package.label}</DropdownMenu.CheckboxItem>
		{/each}
		<DropdownMenu.Separator />
			<Button variant="ghost">Close</Button>
	</DropdownMenu.Content>
</DropdownMenu.Root>