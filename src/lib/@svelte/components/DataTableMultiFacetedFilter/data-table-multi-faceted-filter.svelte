<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import * as Tabs from '@/components/ui/tabs';
	import { Separator } from '@/components/ui/separator';
	import { Badge } from '@/components/ui/badge';
	import { cn } from '@/utils/ui';
	import { _ } from '@services';
	import { Check, Filter } from '@lucide/svelte';
	import type { Component } from 'svelte';
	import { ScrollArea } from '@/components/ui/scroll-area';

	type FilterOption = {
		label: string;
		value: string;
		icon?: Component;
	};

	type FilterCategory = {
		key: string;
		label: string;
		options: FilterOption[];
	};

	interface Props {
		title: string;
		categories: FilterCategory[];
		counts?: { [category: string]: { [value: string]: number } };
		selectedValues: { [category: string]: string[] };
	}

	let { title, categories = [], counts = {}, selectedValues = $bindable() }: Props = $props();

	let open = $state(false);
	let activeTab = $state(categories[0]?.key || '');

	// Calculate total number of selected filters across all categories
	let totalSelected = $derived(
		Object.values(selectedValues).reduce((sum, values) => sum + values.length, 0)
	);

	function handleSelect(category: string, value: string) {
		const currentValues = selectedValues[category] || [];
		if (currentValues.includes(value)) {
			selectedValues = {
				...selectedValues,
				[category]: currentValues.filter((v) => v !== value)
			};
		} else {
			selectedValues = {
				...selectedValues,
				[category]: [...currentValues, value]
			};
		}
	}

	function clearAllFilters() {
		const clearedValues: { [category: string]: string[] } = {};
		categories.forEach((cat) => {
			clearedValues[cat.key] = [];
		});
		selectedValues = clearedValues;
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				class={cn('border', totalSelected > 0 && 'border-primary bg-primary/5')}
			>
				<Filter class="mr-2 size-4" />
				{title}

				{#if totalSelected > 0}
					<Separator orientation="vertical" class="mx-2 h-4" />
					<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
						{totalSelected}
					</Badge>
					<div class="hidden space-x-1 lg:flex">
						<Badge variant="secondary" class="rounded-sm px-1 font-normal">
							{$_('components.dataTableFacetedFilter.filterLabelTemplate', {
								values: { count: totalSelected }
							})}
						</Badge>
					</div>
				{/if}
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-[300px] p-0" align="end" side="bottom">
		<Tabs.Root bind:value={activeTab} class="w-full">
			<ScrollArea orientation="horizontal" class="p-1">
				<Tabs.List>
					{#each categories as category (category.key)}
						{@const categorySelectedCount = selectedValues[category.key]?.length || 0}
						<Tabs.Trigger value={category.key} class="relative">
							{category.label}
							{#if categorySelectedCount > 0}
								<Badge variant="secondary" class="ml-1 rounded-full px-1 py-0 text-xs">
									{categorySelectedCount}
								</Badge>
							{/if}
						</Tabs.Trigger>
					{/each}
				</Tabs.List>
			</ScrollArea>

			{#each categories as category (category.key)}
				<Tabs.Content value={category.key}>
					<Command.Root>
						<Command.Input placeholder={category.label} />
						<Command.List>
							<Command.Empty>{$_('components.dataTableFacetedFilter.noResults')}</Command.Empty>
							<Command.Group>
								{#each category.options as option (option.value)}
									{@const Icon = option.icon}
									{@const isSelected = selectedValues[category.key]?.includes(option.value)}
									<Command.Item
										value={option.value}
										onSelect={() => {
											handleSelect(category.key, option.value);
										}}
									>
										<div
											class={cn(
												'border-primary mr-2 flex size-4 items-center justify-center rounded-sm border',
												isSelected
													? 'bg-primary text-primary-foreground'
													: 'opacity-50 [&_svg]:invisible'
											)}
										>
											<Check className={cn('size-4')} />
										</div>
										{#if Icon}
											<Icon class="text-muted-foreground mr-2 size-4" />
										{/if}
										<span>
											{option.label}
										</span>
										{#if counts[category.key]?.[option.value]}
											<span
												class="ml-auto flex size-4 items-center justify-center font-mono text-xs"
											>
												{counts[category.key][option.value]}
											</span>
										{/if}
									</Command.Item>
								{/each}
							</Command.Group>
						</Command.List>
					</Command.Root>
				</Tabs.Content>
			{/each}
		</Tabs.Root>

		{#if totalSelected > 0}
			<div class="border-t p-2">
				<Button variant="ghost" class="w-full justify-center text-center" onclick={clearAllFilters}>
					{$_('components.dataTableFacetedFilter.clearFilters')}
				</Button>
			</div>
		{/if}
	</Popover.Content>
</Popover.Root>
