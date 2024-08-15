<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
	import { _ } from '@services/i18n';
	import {
		addSelectedRows,
		addTableFilter
	} from 'svelte-headless-table/plugins';
	import type { EventRegistration } from '@/services';
	import type { InferInput } from 'valibot';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import * as Table from '@/components/ui/table';
	import { readable } from 'svelte/store';
	import { Chip, SearchInput } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableAddons from './data-table-addons.svelte';
	import DataTablePackages from './data-table-packages.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { BrandingIcon, DocumentIcon, ImageIcon } from '@/@svelte/icons';

	export let data: InferInput<EventRegistration>[] | undefined = [];
	const table = createTable(readable(data), {
		filter: addTableFilter({
			fn: ({ value, filterValue }) => value.toLowerCase().includes(filterValue.toLowerCase()),
		}),
		select: addSelectedRows()
	});

	dayjs.extend(relativeTime);

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
			accessor: ({ organization }) => organization.name,
			header: 'Organization'
		}),
		table.column({
			accessor: ({ contactPerson }) => contactPerson.fullName,
			header: 'Contact Person'
		}),
		table.column({
			accessor: ({ contactPerson, organization }) => contactPerson.phone ?? organization.phone,
			header: 'Phone'
		}),
		table.column({
			accessor: ({ contactPerson, organization }) => contactPerson.email ?? organization.email,
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
			accessor: ({ status }) => status?.text,
			header: 'Status',
			cell: ({ value }) => {
				return createRender(Chip, { status: value || '', variant: 'success' });
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'portraitStatus',
			cell: () => createRender(DocumentIcon),
			header: 'Portrait',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'logoStatus',
			cell: () => createRender(ImageIcon),
			header: 'Logo',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: 'advertisementStatus',
			cell: () => createRender(BrandingIcon),
			header: 'Advert',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ id }) => id,
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
</script>

<section class="flex gap-x-4">
	<SearchInput placeholder={$_('common.search')} bind:value={$filterValue} />
	<div class="flex-grow"></div>
	<DataTableAddons />
	<DataTablePackages />
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