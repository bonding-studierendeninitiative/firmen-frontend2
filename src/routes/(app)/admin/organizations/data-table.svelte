<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
	import { _, dayjs } from '@services';
	import { addColumnFilters, addSelectedRows, addTableFilter } from 'svelte-headless-table/plugins';
	import * as Table from '@/components/ui/table';
	import { get, readable } from 'svelte/store';
	import { DataTableFacetedFilter, SearchInput } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { Building, Network, Star } from 'lucide-svelte';
	import type { getOrgs } from '@/services';

	export let data: Awaited<ReturnType<typeof getOrgs>> = [];
	const table = createTable(readable(data), {
		filter: addTableFilter({
			fn: ({ value, filterValue }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		typeFilter: addColumnFilters(),
		select: addSelectedRows()
	});

	$: orgTypes = [
		{
			label: $_('common.org-types.nonprofit'),
			value: 'nonprofit',
			icon: Star
		},
		{
			label: $_('common.org-types.company'),
			value: 'company',
			icon: Building
		},
		{ label: $_('common.org-types.other'), value: 'other', icon: Network }
	];

	const counts = data.reduce<{
		type: { [index: string]: number };
	}>(
		(acc, { publicMetadata }) => {
			acc.type[publicMetadata?.type] = (acc.type[publicMetadata?.type] || 0) + 1;
			return acc;
		},
		{
			type: {}
		}
	);

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
			header: $_(`admin-pages.organizations.data-table.headers.name`)
		}),
		table.column({
			accessor: 'membersCount',
			header: $_(`admin-pages.organizations.data-table.headers.members-count`)
		}),
		table.column({
			accessor: ({ createdAt }) => dayjs(createdAt).fromNow(),
			header: $_(`admin-pages.organizations.data-table.headers.last-modified`),
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
				return $_(`common.org-types.${value}`);
			},
			plugins: {
				filter: {
					exclude: true
				},
				typeFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || typeof value !== 'string') return true;
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


	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	export let { filterValue } = pluginStates.filter;
	export let { filterValues } = pluginStates.typeFilter;
</script>

<section class="flex gap-x-4">
	<SearchInput placeholder={$_('common.search')} bind:value={$filterValue} />
	<div class="flex-grow"></div>
	<DataTableFacetedFilter
		bind:filterValues={$filterValues.organizationType}
		title={$_("admin-pages.organizations.data-table.filters.type.title")}
		options={orgTypes}
		counts={counts.type}
	/>
</section>
<section class="mt-10">
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										<Render of={cell.render()} />
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
										<Render of={cell.render()} />
									</Table.Cell>
								</Subscribe>
							{/each}
						</Table.Row>
					</Subscribe>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
</section>
