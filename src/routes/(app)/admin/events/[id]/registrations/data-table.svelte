<script lang="ts">
	import { createTable, Subscribe, Render, createRender } from 'svelte-headless-table';
	import { _, dayjs, locale } from '@services';
	import {
		addColumnFilters,
		addHiddenColumns,
		addSelectedRows,
		addTableFilter
	} from 'svelte-headless-table/plugins';
	import type { InferOutput } from 'valibot';
	import * as Table from '@/components/ui/table';
	import { get, readable } from 'svelte/store';
	import {
		AdvertStatusIcon,
		Chip,
		DataTableFacetedFilter,
		PortraitStatusIcon,
		LogoStatusIcon,
		SearchInput
	} from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import ExportCatalogueDataForm from './export-catalogue-data-form.svelte';
	import SimpleEventRegistrationOrganization from './simple-event-registration-organization.svelte';
	import type {
		ExportCatalogueDataRequest,
		GetEventRegistrationsForEventResponse
	} from '@schema';
	import { getContext } from 'svelte';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';

	export let data: InferOutput<GetEventRegistrationsForEventResponse>['eventRegistrations'];
	export let packages: string[] = [];
	export let status: string[] = [];
	export let addonPackages: string[] = [];
	export let addons: string[] = [];

	console.log("DataTable:", {data, packages, status, addonPackages, addons});
	let exportCatalogueDataForm: SuperValidated<Infer<ExportCatalogueDataRequest>> = getContext('exportCatalogueDataForm');

	let table = createTable(readable(data), {
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

	$: counts = data.reduce<{
		package: { [index: string]: number };
		status: { [index: string]: number };
		addonPackages: { [index: string]: number };
		addons: { [index: string]: number };
	}>(
		(acc, { purchasedPackage, status, addonPackages }) => {
			acc.package[purchasedPackage.name] = (acc.package[purchasedPackage.name] || 0) + 1;
			if (status) {
				acc.status[status] = (acc.status[status] || 0) + 1;
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
			accessor: ({ organization }) => organization,
			header: $_('admin-pages.events.event-registrations.data-table.headers.org'),
			id: 'organization',
			cell: ({ value }) => {
				return createRender(SimpleEventRegistrationOrganization, {
					organization: value,
				})
			}
		}),
		table.column({
			accessor: ({ purchasedPackage }) => purchasedPackage.name,
			header: $_('admin-pages.events.event-registrations.data-table.headers.package'),
			id: 'package',
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
			accessor: ({ createdAt, modifiedAt }) => dayjs(modifiedAt ?? createdAt, {}, $locale ?? 'de').fromNow(),
			header: $_('admin-pages.events.event-registrations.data-table.headers.last-modified'),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ status }) => status,
			header: $_('admin-pages.events.event-registrations.data-table.headers.status'),
			id: 'status',
			cell: ({ value }) => {
				return createRender(Chip, { status: $_(`common.event-registration-status.${value}`), variant: value });
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
			accessor: ({ portraitStatus }) => portraitStatus ?? '',
			cell: ({ value }) => createRender(PortraitStatusIcon, { variant: value }),
			header: $_('admin-pages.events.event-registrations.data-table.headers.portrait-status'),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ logoStatus }) => logoStatus,
			cell: ({ value }) => createRender(LogoStatusIcon, { variant: value }),
			header: $_('admin-pages.events.event-registrations.data-table.headers.logo-status'),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ advertisementStatus }) => advertisementStatus,
			cell: ({ value }) => createRender(AdvertStatusIcon, { variant: value }),
			header: $_('admin-pages.events.event-registrations.data-table.headers.advert-status'),
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
					eventRegistration: value
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
						console.log({ filterValue, value });
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

	let enableExport = pluginStates.select.someRowsSelected;
	export let { filterValue } = pluginStates.filter;
	export let { filterValues: packageFilterValues } = pluginStates.packageFilter;
	export let { filterValues: statusFilterValues } = pluginStates.statusFilter;
	export let { filterValues: addonPackageFilterValues } = pluginStates.addonPackageFilter;
	export let { filterValues: addonFilterValues } = pluginStates.addonFilter;
	export let { hiddenColumnIds } = pluginStates.hide;
</script>

<section class="flex gap-4 flex-wrap justify-end">
	<SearchInput placeholder={$_('common.search')} bind:value={$filterValue} />
	<div class="flex-grow"></div>
	<DataTableFacetedFilter
		title={$_("admin-pages.events.event-registrations.data-table.filters.status")}
		options={status.map((_package) => ({
			label: _package,
			value: _package,
			checked: false
		}))}
		bind:filterValues={$statusFilterValues.status}
		counts={counts?.status}
	/>
	<DataTableFacetedFilter
		title={$_("admin-pages.events.event-registrations.data-table.filters.package")}
		options={packages.map((_package) => ({
			label: _package,
			value: _package,
			checked: false
		}))}
		bind:filterValues={$packageFilterValues.package}
		counts={counts?.package}
	/>
	<DataTableFacetedFilter
		counts={counts?.addonPackages}
		options={addonPackages.map((addonPackage) => ({
			label: addonPackage,
			value: addonPackage
		}))}
		bind:filterValues={$addonPackageFilterValues["addon-packages"]}
		title={$_("admin-pages.events.event-registrations.data-table.filters.addon-packages")}
	/>
	<DataTableFacetedFilter
		options={addons.map((addon) => ({
			label: addon,
			value: addon
		}))}
		bind:filterValues={$addonFilterValues.addons}
		title={$_("admin-pages.events.event-registrations.data-table.filters.addons")}
		counts={counts?.addons}
	/>
	<ExportCatalogueDataForm disabled={!$enableExport} {exportCatalogueDataForm} selectedEventRegistrations={Object.entries(get(pluginStates.select.selectedDataIds)).map(([id, selected]) => ({
				id,
				selected
			})).map(({ id }) => {
				return $pageRows.find((row) => row.isData() && row.dataId === id)?.original.id;
			})} />
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
