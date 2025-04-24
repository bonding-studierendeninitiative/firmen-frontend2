<script lang="ts" module>
	type TData = any;
	type TValue = any;
</script>

<script lang="ts" generics="TData, TValue">
	import { Button } from '@/components/ui/button';
	import type { Column } from '@tanstack/table-core';
	import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-svelte';
	import type { ComponentProps } from 'svelte';
	import { queryParameters } from 'sveltekit-search-params';

	
	let params = queryParameters({
		sort: false,
		page: false,
		limit: false
	});

	let { column }: {column: {id: string, header: string}} = $props()

	// Sorting functions
	function toggleSort(columnId: string) {
		const currentSort = $params.sort;
		if (currentSort?.startsWith('-') && currentSort.slice(1) === columnId) {
			$params.sort = null;
		} else if (currentSort?.slice(1) === columnId) {
			$params.sort = `-${columnId}`;
		} else {
			$params.sort = `+${columnId}`;
		}
	}

	function getSortDirection(columnId: string): 'asc' | 'desc' | false {
		const currentSort = $params.sort;
		if (!currentSort) return false;
		if (currentSort === `+${columnId}`) return 'asc';
		if (currentSort === `-${columnId}`) return 'desc';
		return false;
	}
</script>

<Button class="px-0.5"
									variant="ghost"
									on:click={() => toggleSort(column.id)}
								>
									{column.header}
									{#if getSortDirection(column.id) === 'asc'}
										<ArrowDown class="ml-2 h-4 w-4" />
									{:else if getSortDirection(column.id) === 'desc'}
										<ArrowUp class="ml-2 h-4 w-4" />
									{:else}
										<ArrowUpDown class="ml-2 h-4 w-4" />
									{/if}
								</Button>