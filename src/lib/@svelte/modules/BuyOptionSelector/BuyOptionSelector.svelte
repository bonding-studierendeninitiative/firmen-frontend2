<script lang="ts">
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import { Button } from '@/components/ui/button';
	import { ChevronsUpDown, PlusCircle } from 'lucide-svelte';
	import Check from 'lucide-svelte/icons/check';
	import { cn } from '@/utils';
	import { tick } from 'svelte';
	import { Badge } from '@/components/ui/badge';

	export let open: boolean = false;
	export let buyOptions: { label: string, value: string, active: boolean }[];
	export let onSelect: (value: string) => void;
	export let value = '';
	export let isDialogOpen = false;


	$: selectedValue =
		buyOptions.find((f) => f.value === value)?.label ??
		'Select a framework...';

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

</script>

<Popover.Root bind:open let:ids>
	<Popover.Trigger asChild let:builder>
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
	</Popover.Trigger>
	<Popover.Content class="w-[300px] p-0">
		<Command.Root>
			<Command.Input placeholder="Search for a buy option..." />
			<Command.List>
				<Command.Empty>No buy option found.</Command.Empty>
				<Command.Group>
					{#each buyOptions as buyOption}
						<Command.Item
							class="flex"
							value={buyOption.value}
							onSelect={(currentValue) => {
              value = currentValue;
              closeAndFocusTrigger(ids.trigger);
							onSelect(value);
            }}
						>
							<Check
								class={cn(
                "mr-2 h-4 w-4",
                value !== buyOption.value && "text-transparent"
              )}
							/>
							<span class="flex-grow">{buyOption.label}</span>
							{#if buyOption.active}
								<Badge variant="outline">aktiv</Badge>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
			<Command.Separator />
			<Command.List>
				<Command.Group>
					<Command.Item onSelect={() => {
						open = false;
						isDialogOpen = true;
					}}>
						<PlusCircle class="mr-2 h-4 w-4" />
						Create a new buy option&hellip;
					</Command.Item>
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>

