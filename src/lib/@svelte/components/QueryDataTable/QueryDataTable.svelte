<script lang="ts" module>
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
	import { type Readable } from 'svelte/store';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { queryParameters } from 'sveltekit-search-params';
	import {
		createSvelteTable,
		getCoreRowModel,
		getPaginationRowModel
	} from '@tanstack/svelte-table';
	import type { ColumnDef, OnChangeFn, SortingState, TableOptions } from '@tanstack/svelte-table';
	import FlexRender from './flex-render.svelte';
	import Skeleton from '@/components/ui/skeleton/skeleton.svelte';

	// Default props
	let {
		data,
		totalCount,
		isLoading = false,
		columns,
		pageSizes = [10, 20, 50, 100]
	}: DataTableProps<any> = $props();

	let sorting = $state<SortingState>([]);

	const setSorting: OnChangeFn<SortingState> = (updater) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}

		if (sorting.length > 0) {
			let firstSort = sorting[0];

			$params.sort = (firstSort.desc ? '-' : '+') + firstSort.id;
		} else {
			$params.sort = null;
		}
	};

	let options: TableOptions<any> = $derived({
		columns,
		data,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		manualSorting: true, //use pre-sorted row model instead of sorted row model
		state: {
			sorting
		},
		onSortingChange: setSorting
	});

	const table = $derived(createSvelteTable(options));

	let params = queryParameters({
		sort: false,
		page: false,
		limit: false
	});

	// Pagination functions
	let selectedPageSize = $derived.by(() => ({
		label: $params.limit ?? '10',
		value: Number($params.limit ?? '10')
	}));

	function nextPage() {
		const currentPage = Number($params.page);
		$params.page = (currentPage + 1).toString();
	}

	function previousPage() {
		const currentPage = Number($params.page);
		$params.page = (currentPage - 1).toString();
	}

	let hasNextPage = $derived.by(() => {
		const currentPage = Number($params.page);
		const limit = Number($params.limit ?? '10');
		console.log('Limit:', limit, 'Page:', currentPage);
		return currentPage * limit + limit < $totalCount;
	});

	let hasPreviousPage = $derived.by(() => {
		const currentPage = Number($params.page);
		return currentPage > 0;
	});
</script>

<section class="mt-4 space-y-4">
	<div class="rounded-md border">
		<Table.Root>
			<Table.Header>
				{#each $table.getHeaderGroups() as headerGroup (headerGroup.id)}
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
					{#each $table.getRowModel().rows as row (row.id)}
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
					{#each { length: Number($params.limit) || 10 } as _, i}
						<Table.Row>
							{#each columns as column}
								<Table.Cell>
									<Skeleton class="w-full min-size-6" />
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
					$params.limit = v;
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
