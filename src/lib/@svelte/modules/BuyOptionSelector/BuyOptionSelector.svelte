<script lang="ts">
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import { Button } from '@/components/ui/button';
	import { ChevronsUpDown, PlusCircle } from '@lucide/svelte';
	import Check from '@lucide/svelte/icons/check';
	import { cn } from '@/utils/ui';
	import { getContext, tick } from 'svelte';
	import { Badge } from '@/components/ui/badge';
	import { _ } from '@services';
	import type { Writable } from 'svelte/store';

	interface Props {
		open?: boolean;
		buyOptions: { label: string; value: string; active: boolean }[];
		onSelect: (value: string) => void;
		value?: string;
		isDialogOpen?: any;
	}

	let {
		open = $bindable(false),
		buyOptions,
		onSelect,
		value = $bindable(''),
		isDialogOpen = getContext<Writable<boolean>>('isCreateBuyOptionDialogOpen')
	}: Props = $props();

	let selectedValue = $derived(
		buyOptions.find((f) => f.value === value)?.label ?? $_('modules.buy-option-selector.select')
	);

	let triggerRef = $state<HTMLButtonElement>(null!);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		open = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}
</script>

<Popover.Root bind:open>
	{#snippet children()}
		<Popover.Trigger bind:ref={triggerRef}>
			{#snippet child({ props })}
				<Button
					{...props}
					variant="outline"
					role="combobox"
					aria-expanded={open}
					class="w-[300px] justify-between"
				>
					{selectedValue}
					<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
				</Button>
			{/snippet}
		</Popover.Trigger>
		<Popover.Content class="w-[300px] p-0">
			<Command.Root>
				<Command.Input placeholder={$_('modules.buy-option-selector.search-placeholder')} />
				<Command.List>
					<Command.Empty>{$_('modules.buy-option-selector.no-buy-options')}</Command.Empty>
					<Command.Group>
						{#each buyOptions as buyOption}
							<Command.Item
								class="flex"
								value={buyOption.value}
								onSelect={() => {
									value = buyOption.value;
									closeAndFocusTrigger();
									onSelect(value);
								}}
							>
								<Check class={cn('mr-2 size-4', value !== buyOption.value && 'text-transparent')} />
								<span class="grow">{buyOption.label}</span>
								{#if buyOption.active}
									<Badge variant="outline">{$_('modules.buy-option-selector.active')}</Badge>
								{/if}
							</Command.Item>
						{/each}
					</Command.Group>
				</Command.List>
				<Command.Separator />
				<Command.List>
					<Command.Group>
						<Command.Item
							onSelect={() => {
								open = false;
								$isDialogOpen = true;
							}}
						>
							<PlusCircle class="mr-2 size-4" />
							{$_('modules.buy-option-selector.create-new')}
						</Command.Item>
					</Command.Group>
				</Command.List>
			</Command.Root>
		</Popover.Content>
	{/snippet}
</Popover.Root>
