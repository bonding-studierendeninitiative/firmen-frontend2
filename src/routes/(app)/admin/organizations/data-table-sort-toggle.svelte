<script lang="ts" module>
	type TData = any;
	type TValue = any;
</script>

<script lang="ts" generics="TData, TValue">
	import { Button } from '@/components/ui/button';
	import type { Column } from '@tanstack/table-core';
	import { ArrowUp, ArrowDown, ArrowUpDown } from '@lucide/svelte';

	let { column, state }: { column: { id: string; header: string }; state: Column<TData, TValue> } =
		$props();

	let sortDirection = $derived.by(() => {
		if (state.getCanSort()) {
			return state.getIsSorted();
		} else {
			return null;
		}
	});

	$inspect(sortDirection);
</script>

<Button class="px-0.5" variant="ghost" onclick={() => state.toggleSorting()}>
	{column.header}
	{#if sortDirection === 'asc'}
		<ArrowDown class="ml-2 size-4" />
	{:else if sortDirection === 'desc'}
		<ArrowUp class="ml-2 size-4" />
	{:else}
		<ArrowUpDown class="ml-2 size-4" />
	{/if}
</Button>
