<script lang="ts" module>
	// Generic type for data table props
	export interface DataTableProps<T> {
		data: T[];
		totalCount: number;
		isLoading?: boolean;
		columns: ColumnDef<T>[];
		pageSizes?: number[];
		page?: number;
		pageSize?: number;
		sortBy?: string | null;
		sortDirection?: 'asc' | 'desc' | null;
	}
</script>

<script lang="ts">
	import { _ } from '@services';
	import * as Table from '@/components/ui/table';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import {
		getCoreRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues,
		getFilteredRowModel,
		getPaginationRowModel,
		getSortedRowModel
	} from '@tanstack/table-core';
	import type {
		ColumnDef,
		ColumnFiltersState,
		OnChangeFn,
		PaginationState,
		RowSelectionState,
		SortingState,
		TableOptions,
		VisibilityState
	} from '@tanstack/table-core';
	import Skeleton from '@/components/ui/skeleton/skeleton.svelte';
	import { createSvelteTable } from './data-table.svelte';
	import FlexRender from './flex-render.svelte';

	// Default props
	let {
		data,
		totalCount,
		isLoading = false,
		columns,
		pageSizes = [10, 20, 50, 100],
		page = $bindable(0),
		pageSize = $bindable(10),
		sortBy = $bindable(''),
		sortDirection = $bindable('asc')
	}: DataTableProps<any> = $props();

	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({});
	let columnFilters = $state<ColumnFiltersState>([]);
	// let sorting = $state<SortingState>(sortBy ? [{ id: sortBy, desc: sortDirection === 'desc' }] : []);
	let pagination = $derived<PaginationState>({ pageIndex: page, pageSize: pageSize });

	const setSorting: OnChangeFn<SortingState> = (updater) => {
		let sorting: SortingState = sortBy ? [{ id: sortBy, desc: sortDirection === 'desc' }] : [];

		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}

		if (sorting.length > 0) {
			let firstSort = sorting[0];

			sortBy = firstSort.id;
			sortDirection = firstSort.desc ? 'desc' : 'asc';
		} else {
			sortBy = null;
			sortDirection = null;
		}
	};

	const table = createSvelteTable({
		get data() {
			return data;
		},
		get columns() {
			return columns;
		},
		state: {
			get sorting() {
				return sortBy ? [{ id: sortBy, desc: sortDirection === 'desc' }] : [];
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return columnFilters;
			},
			get pagination() {
				return pagination;
			}
		},
		manualSorting: true,
		enableRowSelection: true,
		onRowSelectionChange: (updater) => {
			if (typeof updater === 'function') {
				rowSelection = updater(rowSelection);
			} else {
				rowSelection = updater;
			}
		},
		onSortingChange: setSorting,
		onColumnFiltersChange: (updater) => {
			if (typeof updater === 'function') {
				columnFilters = updater(columnFilters);
			} else {
				columnFilters = updater;
			}
		},
		onColumnVisibilityChange: (updater) => {
			if (typeof updater === 'function') {
				columnVisibility = updater(columnVisibility);
			} else {
				columnVisibility = updater;
			}
		},
		onPaginationChange: (updater) => {
			if (typeof updater === 'function') {
				pagination = updater(pagination);
			} else {
				pagination = updater;
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues()
	});

	// Pagination functions
	let selectedPageSize = $derived.by(() => ({
		label: pageSize ?? '10',
		value: Number(pageSize ?? '10')
	}));

	function nextPage() {
		const currentPage = Number(page ?? '0');
		page = currentPage + 1;
	}

	function previousPage() {
		const currentPage = Number(page ?? '0');
		page = currentPage - 1;
	}

	let hasNextPage = $derived.by(() => {
		const currentPage = Number(page ?? '0');
		const limit = Number(pageSize ?? '10');
		console.log('Limit:', limit, 'Page:', currentPage);
		return currentPage * limit + limit < totalCount;
	});

	let hasPreviousPage = $derived.by(() => {
		const currentPage = Number(page ?? '0');
		return currentPage > 0;
	});
</script>

<section class="mt-4 space-y-4">
	<div class="rounded-md border bg-card border-border shadow shadow-card">
		<Table.Root>
			<Table.Header>
				{#each table.getHeaderGroups() as headerGroup (headerGroup.id)}
					<Table.Row>
						{#each headerGroup.headers as header (header.id)}
							<Table.Head>
								{#if !header.isPlaceholder}
									<FlexRender
										content={header.column.columnDef.header}
										context={header.getContext()}
									/>
								{/if}
							</Table.Head>
						{/each}
					</Table.Row>
				{/each}
			</Table.Header>
			<Table.Body>
				{#if !isLoading}
					{#each table.getRowModel().rows as row (row.id)}
						<Table.Row data-state={row.getIsSelected() && 'selected'}>
							{#each row.getVisibleCells() as cell (cell.id)}
								<Table.Cell>
									<FlexRender content={cell.column.columnDef.cell} context={cell.getContext()} />
								</Table.Cell>
							{/each}
						</Table.Row>
					{:else}
						<Table.Row>
							<Table.Cell colspan={columns.length} class="h-24 text-center">No results.</Table.Cell>
						</Table.Row>
					{/each}
				{:else}
					{#each { length: Number(pageSize ?? '10') } as _, i}
						<Table.Row>
							{#each columns as column}
								<Table.Cell>
									<Skeleton class="w-full min-h-6 min-w-4" />
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
				type="single"
				value={selectedPageSize.value.toString()}
				onValueChange={(v) => {
					pageSize = Number(v);
				}}
			>
				<Select.Trigger>
					{selectedPageSize?.label}
				</Select.Trigger>
				<Select.Content>
					{#each pageSizes as size}
						<Select.Item label={String(size)} value={size.toString()}>
							{size}
						</Select.Item>
					{/each}
				</Select.Content>
			</Select.Root>
		</div>
		<Button variant="outline" size="sm" onclick={previousPage} disabled={!hasPreviousPage}
			>{$_('common.previous')}
		</Button>
		<Button variant="outline" size="sm" disabled={!hasNextPage} onclick={nextPage}
			>{$_('common.next')}
		</Button>
	</div>
</section>
