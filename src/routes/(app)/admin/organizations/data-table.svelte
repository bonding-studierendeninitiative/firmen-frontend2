<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
	import { _ } from '@services';
	import {
		addColumnFilters,
		addPagination,
		addSelectedRows,
		addTableFilter,
		addSortBy
	} from 'svelte-headless-table/plugins';
	import * as Table from '@/components/ui/table';
	import { get, readable, writable } from 'svelte/store';
	import { LocalizedDate } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import type { getOrgs } from '@/services';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';

	export let organizations: Awaited<ReturnType<typeof getOrgs>> = [];

	const table = createTable(readable(organizations.data), {
		page: addPagination({
			serverSide: true,
			serverItemCount: writable(organizations.totalCount),
			initialPageIndex: $page.url.searchParams.get('page')
				? Number($page.url.searchParams.get('page'))
				: undefined,
			initialPageSize: $page.url.searchParams.get('limit')
				? Number($page.url.searchParams.get('limit'))
				: undefined
		}),
		sort: addSortBy({
			serverSide: true,
			initialSortKey: $page.url.searchParams.get('sort') ? decodeURIComponent($page.url.searchParams.get('sort')!) : undefined
		}),
		filter: addTableFilter({
			serverSide: true,
			initialFilterValue: $page.url.searchParams.get('filter') || undefined,
			fn: ({ value, filterValue }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		typeFilter: addColumnFilters(),
		select: addSelectedRows()
	});


	const columns = table.createColumns([
		table.column({
			accessor: 'id',
			header: (_, { pluginStates }) => {
				const { allPageRowsSelected } = pluginStates.select;
				return createRender(DataTableCheckbox, {
					checked: allPageRowsSelected
				});
			},
			cell: ({ row }, { pluginStates }) => {
				const { getRowState } = pluginStates.select;
				const { isSelected } = getRowState(row);

				return createRender(DataTableCheckbox, {
					checked: isSelected
				});
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'name',
			id: 'name',
			header: $_(`admin-pages.organizations.data-table.headers.name`)
		}),
		table.column({
			accessor: 'membersCount',
			id: 'members_count',
			header: $_(`admin-pages.organizations.data-table.headers.members-count`)
		}),
		table.column({
			accessor: ({ createdAt }) => createdAt,
			header: $_(`admin-pages.organizations.data-table.headers.last-modified`),
			id: 'created_at',
			cell: ({ value }) => {
				return createRender(LocalizedDate, { date: value, format: 'relative' });
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ publicMetadata }) => publicMetadata?.type,
			id: 'organizationType',
			header: $_(`admin-pages.organizations.data-table.headers.type`),
			cell: ({ value }) => {
				return value ? $_(`common.org-types.${value}`) : '';
			},
			plugins: {
				filter: {
					exclude: true
				},
				typeFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || typeof value !== 'string') return false;
						return filterValue.some((filter) => {
							return value.includes(filter);
						});
					},
					initialFilterValue: [],
					render: ({ filterValue }) => {
						return get(filterValue);
					}
				}
			}
		}),
		table.column({
			accessor: ({ slug }) => slug,
			id: 'slug',
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value });
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		})

	]);


	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex, pageSize } = pluginStates.page;
	export let { filterValue } = pluginStates.filter;
	const { sortKeys } = pluginStates.sort;


	let timeout: unknown | null = null;

	filterValue.subscribe(value => {
		if (value === '' && $page.url.searchParams.get('filter') === null) return;
		if ($page.url.searchParams.get('filter') === value) return;

		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(async () => {
				const q = new URLSearchParams($page.url.searchParams);
				q.set('filter', value);
				goto(`?${q}`, { noScroll: true });
			}, 600
		);
	});

	sortKeys.subscribe(value => {
		if (value.length) {
			const q = new URLSearchParams($page.url.searchParams);
			q.set('sort', (value[0].order === 'asc' ? '+' : '-') + value[0].id);
			goto(`?${q}`, { noScroll: true });
		}
	});

	function nextPage() {
		console.log($pageIndex);

		$pageIndex = $pageIndex + 1;
		const q = new URLSearchParams($page.url.searchParams);
		q.set('page', $pageIndex.toString());
		goto(`?${q}`, { noScroll: true });
	}

	function previousPage() {
		$pageIndex = $pageIndex - 1;
		const q = new URLSearchParams($page.url.searchParams);
		q.set('page', $pageIndex.toString());
		goto(`?${q}`, { noScroll: true });
	}

	const pageSizes = [10, 20, 50, 100];
	$: selectedPageSize = $pageSize
		? {
			label: String($pageSize),
			value: $pageSize
		}
		: undefined;
	pageSize.subscribe(value => {
		const q = new URLSearchParams($page.url.searchParams);
		q.set('limit', String(value));
		goto(`?${q}`, { noScroll: true });
	});
</script>

<section class="mt-10">
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs}>
										{#if cell.id === 'name' || cell.id === 'members_count' || cell.id === 'created_at'}
											<Button class="px-0" variant="ghost" on:click={props.sort.toggle}>
												<Render of={cell.render()} />
												<ArrowUpDown class={'h-4 w-4'} />
											</Button>
										{:else}
											<Render of={cell.render()} />
										{/if}
									</Table.Head>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Header>
			<Table.Body {...$tableBodyAttrs}>
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id === "name"}
											<a href={`/admin/organizations/${row.original.slug}`} class="hover:underline">
												<Render of={cell.render()} />
											</a>
										{:else }
											<Render of={cell.render()} />
										{/if}
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<div class="flex items-center justify-end space-x-4">
		<div class="min-w-min">
			<Select.Root bind:selected={selectedPageSize} onSelectedChange={(v) => {
         pageSize.set(v?.value);
        }}>
				<Select.Trigger>
					{selectedPageSize?.label}
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
		<Button
			variant="outline"
			size="sm"
			on:click={previousPage}
			disabled={!$hasPreviousPage}
		>{$_("common.previous")}
		</Button>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={nextPage}
		>{$_("common.next")}
		</Button>
	</div>
</section>


