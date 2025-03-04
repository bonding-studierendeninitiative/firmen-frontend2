<script lang="ts">
	import PlusCircled from 'svelte-radix/PlusCircled.svelte';
	import Check from 'svelte-radix/Check.svelte';
	import { Button } from '@/components/ui/button';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import { Separator } from '@/components/ui/separator';
	import { Badge } from '@/components/ui/badge';
	import { cn } from '@/utils/tailwind';
	import { _ } from '@services';
	import type { Component } from 'svelte-eslint-parser/lib/parser/svelte-ast-types-for-v5';

	type Options = {
		label: string;
		value: string;
		icon?: Component;
	};
	export let filterValues: string[] | undefined = [];
	export let title: string;
	export let options = [] as Options[];
	export let counts: { [index: string]: number } = {};

	let open = false;

	function handleSelect(currentValue: string) {
		if (Array.isArray(filterValues) && filterValues.includes(currentValue)) {
			filterValues = filterValues.filter((v) => v !== currentValue);
		} else {
			filterValues = [...(Array.isArray(filterValues) ? filterValues : []), currentValue];
		}
	}
</script>

<Popover.Root bind:open>
	<Popover.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" size="sm" class="h-8 border-dashed">
			<PlusCircled class="mr-2 h-4 w-4" />
			{title}

			{#if filterValues?.length > 0}
				<Separator orientation="vertical" class="mx-2 h-4" />
				<Badge variant="secondary" class="rounded-sm px-1 font-normal lg:hidden">
					{filterValues.length}
				</Badge>
				<div class="hidden space-x-1 lg:flex">
					{#if filterValues.length > 2}
						<Badge variant="secondary" class="rounded-sm px-1 font-normal">
							{$_("components.dataTableFacetedFilter.filterLabelTemplate", {
								values: { count: filterValues.length }
							})}
						</Badge>
					{:else}
						{#each filterValues as option}
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
									filterValues?.includes(option.value)
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
				{#if filterValues?.length > 0}
					<Command.Separator />
					<Command.Item
						class="justify-center text-center"
						onSelect={() => {
							filterValues = [];
						}}
					>
						{$_("components.dataTableFacetedFilter.clearFilters")}
					</Command.Item>
				{/if}
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>
