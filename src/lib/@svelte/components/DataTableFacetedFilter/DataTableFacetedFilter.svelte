<script lang="ts">
	import Check from 'svelte-radix/Check.svelte';
	import { Button } from '@/components/ui/button';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import { Separator } from '@/components/ui/separator';
	import { Badge } from '@/components/ui/badge';
	import { cn } from '@/utils/tailwind';
	import { _ } from '@services';
	import type { Component } from 'svelte-eslint-parser/lib/parser/svelte-ast-types-for-v5';
	import { Filter } from 'lucide-svelte';
	import { createEventDispatcher } from 'svelte';

	type Options = {
		label: string;
		value: string;
		icon?: Component;
	};

	export let title: string;
	export let options = [] as Options[];
	export let counts: { [index: string]: number } = {};

	let open = false;
	let selectedValues: string[] = [];
	const dispatch = createEventDispatcher<{
		filterChange: string[];
	}>();

	function handleSelect(currentValue: string) {
		if (selectedValues.includes(currentValue)) {
			selectedValues = selectedValues.filter((v) => v !== currentValue);
		} else {
			selectedValues = [...selectedValues, currentValue];
		}
		dispatch('filterChange', selectedValues);
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" class="border">
			<Filter class="mr-2 h-4 w-4" />
			{title}

			{#if selectedValues?.length > 0}
				<Separator orientation="vertical" class="mx-2 h-4" />
				<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
					{selectedValues.length}
				</Badge>
				<div class="hidden space-x-1 lg:flex">
					{#if selectedValues.length > 2}
						<Badge variant="secondary" class="rounded-sm px-1 font-normal">
							{$_("components.dataTableFacetedFilter.filterLabelTemplate", {
								values: { count: selectedValues.length }
							})}
						</Badge>
					{:else}
						{#each selectedValues as option}
							<Badge variant="secondary" class="rounded-sm px-1 font-normal">
								{option}
							</Badge>
						{/each}
					{/if}
				</div>
			{/if}
		</Button>
	</Popover.Trigger>
	<Popover.Content class="w-[200px] p-0" align="start" side="bottom">
		<Command.Root>
			<Command.Input placeholder={title} />
			<Command.List>
				<Command.Empty>{$_("components.dataTableFacetedFilter.noResults")}</Command.Empty>
				<Command.Group>
					{#each options as option}
						{@const Icon = option.icon}
						<Command.Item
							value={option.value}
							onSelect={(currentValue) => {
								handleSelect(currentValue);
							}}
						>
							<div
								class={cn(
									'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
									selectedValues?.includes(option.value)
										? 'bg-primary text-primary-foreground'
										: 'opacity-50 [&_svg]:invisible'
								)}
							>
								<Check className={cn('h-4 w-4')} />
							</div>
							{#if Icon}
								<Icon class="text-muted-foreground mr-2 h-4 w-4" />
							{/if}
							<span>
								{option.label}
							</span>
							{#if counts[option.value]}
								<span class="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
									{counts[option.value]}
								</span>
							{/if}
						</Command.Item>
					{/each}
				</Command.Group>
				{#if selectedValues?.length > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center text-center"
						onSelect={() => {
							selectedValues = [];
							dispatch('filterChange', selectedValues);
						}}
					>
						{$_("components.dataTableFacetedFilter.clearFilters")}
					</Command.Item>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
