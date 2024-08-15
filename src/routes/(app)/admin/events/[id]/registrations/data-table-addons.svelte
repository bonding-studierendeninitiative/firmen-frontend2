<script lang="ts">
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';

	const addonPackages = [
		{ label: 'Onlinewerbung-Paket', value: 'Onlinewerbung-Paket', checked: false },
		{ label: 'Printwerbung-Paket', value: 'Printwerbung-Paket', checked: false }
	];

	let open = false;
	let value = '';

	$: selectedValue =
		addonPackages.find((f) => f.value === value)?.label ?? 'Select an addon package...';
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
		<DropdownMenu.Label>Addon Packages</DropdownMenu.Label>
		<DropdownMenu.Separator />
		<DropdownMenu.CheckboxItem onCheckedChange={(a) => {if (a) {
			addonPackages.forEach((addonPackage) => addonPackage.checked = false)
		}}}>All addon packages
		</DropdownMenu.CheckboxItem>
		<DropdownMenu.Separator />
		{#each addonPackages as addonPackage}
			<DropdownMenu.CheckboxItem bind:checked={addonPackage.checked}>{addonPackage.label}</DropdownMenu.CheckboxItem>
		{/each}
		<DropdownMenu.Separator />
		<Button variant="ghost">Close</Button>
	</DropdownMenu.Content>
</DropdownMenu.Root>