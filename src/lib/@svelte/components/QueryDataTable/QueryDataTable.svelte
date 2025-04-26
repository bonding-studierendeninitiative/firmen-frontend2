<script lang="ts" module>
	type CellSnippet<TProps> = {
		snippet: Snippet<[TProps]>;
		props: TProps;
	};

	// Generic type for column definition
	export interface ColumnDef<T> {
		id: string;
		header: string | ((state: TableState<T>) => CellSnippet<unknown>);
		accessor?: (row: T) => any;
		cell?: (row: T, state: TableState<T>) => CellSnippet<unknown>;
		sortable?: boolean;
		align?: 'left' | 'center' | 'right';
	}

	// Generic type for data table props
	export interface DataTableProps<T> {
		data: T[];
		totalCount: Readable<number>;
		isLoading?: boolean;
		columns: ColumnDef<T>[];
		pageSizes?: number[];
	}
</script>

<script lang="ts">
	import { _ } from '@services';
	import * as Table from '@/components/ui/table';
	import { derived, type Readable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { queryParameters } from 'sveltekit-search-params';
	import { Skeleton } from '@/components/ui/skeleton';
	import type { Snippet } from 'svelte';
	import { TableViewModel, type TableState } from './table-state.svelte';

	// Default props
	let {
		data,
		totalCount,
		isLoading = false,
		columns,
		pageSizes = [10, 20, 50, 100]
	}: DataTableProps<any> = $props();

	const tableState = new TableViewModel({
		data
	});

	let params = queryParameters({
		sort: false,
		page: false,
		limit: false
	});

	$effect(() => {
		tableState.data = data;
	});

	// Pagination functions
	let selectedPageSize = derived([params], ([params]) => ({
		label: params.limit ?? '10',
		value: Number(params.limit ?? '10')
	}));

	function nextPage() {
		const currentPage = Number($params.page);
		$params.page = (currentPage + 1).toString();
	}

	function previousPage() {
		const currentPage = Number($params.page);
		$params.page = (currentPage - 1).toString();
	}

	let hasNextPage = derived([totalCount, params], ([totalCount, params]) => {
		const currentPage = Number(params.page);
		const limit = Number(params.limit ?? '10');
        console.log("Limit:", limit, "Page:", currentPage)
		return currentPage * limit + limit < totalCount;
	});

	let hasPreviousPage = derived([params], ([params]) => {
		const currentPage = Number(params.page);
		return currentPage > 0;
	});
</script>

<section class="mt-4 space-y-4">
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				<Table.Row>
					{#each columns as column}
						<Table.Head
							class={column.align === 'right'
								? 'text-right'
								: column.align === 'center'
									? 'text-center'
									: ''}
						>
							{#if typeof column.header === 'string'}
								{column.header}
							{:else}
								{@const { snippet, props } = column.header(tableState)}
								{@render snippet(props)}
							{/if}
						</Table.Head>
					{/each}
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#if !isLoading}
					{#each data as row}
						<Table.Row>
							{#each columns as column}
								<Table.Cell
									class={column.align === 'right'
										? 'text-right'
										: column.align === 'center'
											? 'text-center'
											: ''}
								>
									{#if column.cell}
										{@const cellSnippet = column.cell(row, tableState)}
										{@render cellSnippet.snippet(cellSnippet.props)}
									{:else if column.accessor}
										{column.accessor(row)}
									{:else}
										{row[column.id]}
									{/if}
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{:else}
					{#each { length: Number($params.limit) || 10 } as _, i}
						<Table.Row>
							{#each columns as column}
								<Table.Cell>
									<Skeleton class="w-full min-w-6 h-6" />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4">
		<div class="min-w-min">
			<Select.Root
				bind:selected={$selectedPageSize}
				onSelectedChange={(v) => {
					$params.limit = String(v?.value);
				}}
			>
				<Select.Trigger>
					{$selectedPageSize?.label}
				</Select.Trigger>
				<Select.Content>
					{#each pageSizes as size}
						<Select.Item label={String(size)} value={size}>
							{size}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<Button variant="outline" size="sm" on:click={previousPage} disabled={!$hasPreviousPage}
			>{$_('common.previous')}
		</Button>
		<Button variant="outline" size="sm" disabled={!$hasNextPage} on:click={nextPage}
			>{$_('common.next')}
		</Button>
	</div>
</section>
