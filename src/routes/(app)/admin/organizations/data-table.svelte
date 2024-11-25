<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
	import { _ } from '@services/i18n';
	import { addColumnFilters, addSelectedRows, addTableFilter } from 'svelte-headless-table/plugins';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import * as Table from '@/components/ui/table';
	import { get, readable } from 'svelte/store';
	import { DataTableFacetedFilter, SearchInput } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import type { GetOrgDetailsResponse } from '@schema';
	import { orgTypes } from '@constant/orgTypes';
	import { goto } from '$app/navigation';

	export let data: GetOrgDetailsResponse[] = [];
	const table = createTable(readable(data), {
		filter: addTableFilter({
			fn: ({ value, filterValue }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		typeFilter: addColumnFilters(),
		select: addSelectedRows()
	});

	dayjs.extend(relativeTime);

	const counts = data.reduce<{
		type: { [index: string]: number };
	}>(
		(acc, { organizationType }) => {
			acc.type[organizationType] = (acc.type[organizationType] || 0) + 1;
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
			header: 'Organization'
		}),
		table.column({
			accessor: 'organizationPhone',
			header: 'Phone'
		}),
		table.column({
			accessor: 'organizationEmail',
			header: 'Email'
		}),
		table.column({
			accessor: ({ createdAt, modifiedAt }) => dayjs(modifiedAt ?? createdAt).fromNow(),
			header: 'Last modified',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'organizationType',
			header: 'Typ',
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
		title="Type"
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
