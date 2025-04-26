<script lang="ts" module>
	type TData = any;
	type TValue = any;
</script>

<script lang="ts" generics="TData, TValue">
	import type { TableState } from '@/@svelte/components/QueryDataTable/table-state.svelte';

	import { Button } from '@/components/ui/button';
	import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-svelte';
	import { queryParameters } from 'sveltekit-search-params';

	let params = queryParameters({
		sort: false,
		page: false,
		limit: false
	});

	let { column, state }: { column: { id: string; header: string }; state: TableState<TData> } =
		$props();

	let sortDirection = $derived.by(() => state.getSortDirection(column.id, $params.sort))
</script>

<Button class="px-0.5" variant="ghost" on:click={() => state.toggleSort(column.id, params)}>
	{column.header}
	{#if sortDirection === 'asc'}
		<ArrowDown class="ml-2 h-4 w-4" />
	{:else if sortDirection === 'desc'}
		<ArrowUp class="ml-2 h-4 w-4" />
	{:else}
		<ArrowUpDown class="ml-2 h-4 w-4" />
	{/if}
</Button>
