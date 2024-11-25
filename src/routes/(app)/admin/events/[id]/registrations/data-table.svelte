<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
	import { _ } from '@services/i18n';
	import {
		addColumnFilters,
		addHiddenColumns,
		addSelectedRows,
		addTableFilter
	} from 'svelte-headless-table/plugins';
	import type { InferOutput } from 'valibot';
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime';
	import * as Table from '@/components/ui/table';
	import { get, readable } from 'svelte/store';
	import { Chip, DataTableFacetedFilter, SearchInput } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import { BrandingIcon, DocumentIcon, ImageIcon } from '@/@svelte/icons';
	import type {
		ConfirmEventRegistrationSchema,
		EventRegistration,
		RejectEventRegistrationSchema
	} from '@schema';
	import type { Infer, SuperValidated } from 'sveltekit-superforms';

	export let data: InferOutput<EventRegistration>[] = [];
	export let confirmForm: SuperValidated<Infer<ConfirmEventRegistrationSchema>>;
	export let rejectForm: SuperValidated<Infer<RejectEventRegistrationSchema>>;
	export let packages: string[];
	export let status: string[];
	export let addonPackages: string[];
	export let addons: string[];
	const table = createTable(readable(data), {
		filter: addTableFilter({
			fn: ({ value, filterValue }) => value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		packageFilter: addColumnFilters(),
		statusFilter: addColumnFilters(),
		addonPackageFilter: addColumnFilters(),
		addonFilter: addColumnFilters(),
		select: addSelectedRows(),
		hide: addHiddenColumns({
			initialHiddenColumnIds: ['addon-packages', 'addons']
		})
	});

	dayjs.extend(relativeTime);

	const counts = data?.reduce<{
		package: { [index: string]: number };
		status: { [index: string]: number };
		addonPackages: { [index: string]: number };
		addons: { [index: string]: number };
	}>(
		(acc, { purchasedPackage, status, addonPackages }) => {
			acc.package[purchasedPackage.name] = (acc.package[purchasedPackage.name] || 0) + 1;
			if (status) {
				acc.status[status.text] = (acc.status[status.text] || 0) + 1;
			}
			if (addonPackages) {
				addonPackages.forEach((addonPackage) => {
					acc.addonPackages[addonPackage.title] = (acc.addonPackages[addonPackage.title] || 0) + 1;
					addonPackage.addons.forEach((addon) => {
						acc.addons[addon.title] = (acc.addons[addon.title] || 0) + 1;
					});
				});
			}
			return acc;
		},
		{
			package: {},
			status: {},
			addonPackages: {},
			addons: {}
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
			accessor: ({ purchasedPackage }) => purchasedPackage.name,
			header: 'Package',
			plugins: {
				packageFilter: {
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
				return createRender(Chip, { status: value, variant: 'success' });
			},
			plugins: {
				filter: {
					exclude: true
				},
				statusFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || typeof value !== 'string') return true;
						return filterValue.some((filter) => {
							return value.includes(filter);
						});
					},
					initialFilterValue: []
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
			accessor: (item) => item,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, {
					id: value.id,
					eventRegistration: value,
					confirmForm,
					rejectForm
				});
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ addonPackages }) => addonPackages.map((addonPackage) => addonPackage.title),
			header: 'Addon Packages',
			id: 'addon-packages',
			plugins: {
				filter: {
					exclude: true
				},
				addonPackageFilter: {
					fn: ({ filterValue, value }) => {
						console.log({filterValue, value})
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || !Array.isArray(value)) return true;
						return filterValue.some((filter) => {
							return value.includes(filter);
						});
					},
					initialFilterValue: []
				}
			}
		}),
		table.column({
			accessor: ({ addonPackages }) =>
				addonPackages.flatMap((addonPackage) => addonPackage.addons.map((addon) => addon.title)),
			header: 'Addons',
			id: 'addons',
			plugins: {
				filter: {
					exclude: true
				},
				addonFilter: {
					fn: ({ filterValue, value }) => {
						if (filterValue.length === 0) return true;
						if (!Array.isArray(filterValue) || !Array.isArray(value)) return true;
						return filterValue.some((filter) => {
							return value.includes(filter);
						});
					},
					initialFilterValue: []
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);

	export let { filterValue } = pluginStates.filter;
	export let { filterValues: packageFilterValues } = pluginStates.packageFilter;
	export let { filterValues: statusFilterValues } = pluginStates.statusFilter;
	export let { filterValues: addonPackageFilterValues } = pluginStates.addonPackageFilter;
	export let { filterValues: addonFilterValues } = pluginStates.addonFilter;
	export let { hiddenColumnIds } = pluginStates.hide;
</script>

<section class="flex gap-x-4">
	<SearchInput placeholder={$_('common.search')} bind:value={$filterValue} />
	<div class="flex-grow"></div>
	<DataTableFacetedFilter
		title="All status..."
		options={status.map((_package) => ({
			label: _package,
			value: _package,
			checked: false
		}))}
		bind:filterValues={$statusFilterValues.Status}
		counts={counts?.status}
	/>
	<DataTableFacetedFilter
		title="Select a package..."
		options={packages.map((_package) => ({
			label: _package,
			value: _package,
			checked: false
		}))}
		bind:filterValues={$packageFilterValues.Package}
		counts={counts?.package}
	/>
	<DataTableFacetedFilter
		counts={counts?.addonPackages}
		options={addonPackages.map((addonPackage) => ({
			label: addonPackage,
			value: addonPackage
		}))}
		bind:filterValues={$addonPackageFilterValues.AddonPackages}
		title="All addon packages"
	/>
	<DataTableFacetedFilter
		options={addons.map((addon) => ({
			label: addon,
			value: addon
		}))}
		bind:filterValues={$addonFilterValues.addons}
		title="All addons"
		counts={counts?.addons}
	/>
</section>
<section class="mt-10">
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
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
