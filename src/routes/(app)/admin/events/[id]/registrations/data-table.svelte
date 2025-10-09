<script lang="ts">
	import { _ } from '@services';
	import * as Table from '@/components/ui/table';
	import {
		Chip,
		DataTableFacetedFilter,
		LocalizedDate,
		PortraitStatusIcon,
		SearchInput
	} from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import ExportCatalogueDataDialog from './export-catalogue-data-form.svelte';
	import SimpleEventRegistrationOrganization from './simple-event-registration-organization.svelte';
	import CreateEventRegistrationForm from './create-event-registration-form.svelte';
	import {
		AdminViewAdvertisementDialog,
		AdminViewRegistrationDocumentDialog
	} from '@/@svelte/modules';
	import {
		createColumnHelper,
		getCoreRowModel,
		getFilteredRowModel,
		type RowSelectionState,
		type VisibilityState,
		type ColumnFiltersState,
		type SortingState,
		type PaginationState,
		type OnChangeFn,
		getPaginationRowModel,
		getSortedRowModel,
		getFacetedRowModel,
		getFacetedUniqueValues
	} from '@tanstack/table-core';
	import {
		renderComponent,
		renderSnippet
	} from '@/@svelte/components/QueryDataTable/render-helpers';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import FlexRender from '@/@svelte/components/QueryDataTable/flex-render.svelte';
	import { Skeleton } from '@/components/ui/skeleton';
	import SuperDebug from 'sveltekit-superforms';
	import { createSvelteTable } from '@/@svelte/components/QueryDataTable/data-table.svelte';
	import { Checkbox } from '@/components/ui/checkbox';
	import type { GetEventRegistrationsOutput } from '@/remote/functions/admin';

	let {
		data,
		isLoading,
		onDelete,
		onReject,
		onConfirm,
	}: {
		data: GetEventRegistrationsOutput['eventRegistrations'];
		isLoading: boolean;
		onDelete: ({ eventRegistrationId }: { eventRegistrationId: string }) => Promise<void>;
		onReject: ({ eventRegistrationId }: { eventRegistrationId: string }) => Promise<void>;
		onConfirm: ({ eventRegistrationId }: { eventRegistrationId: string }) => Promise<void>;
	} = $props();

	let packages = $derived([
		...new Set(
			data
				.filter((value) => Boolean(value.purchasedPackage))
				.map((eventRegistration) => eventRegistration.purchasedPackage?.name)
		)
	]);
	let status = $derived([...new Set(data.map((eventRegistration) => eventRegistration.status))]);
	let addonPackages = $derived([
		...new Set(
			data.flatMap(
				(eventRegistration) =>
					eventRegistration.addonPackages?.map((addonPackages) => addonPackages.title ?? '') ?? []
			)
		)
	]);
	let addons = $derived([
		...new Set(
			data?.flatMap(
				(eventRegistration) =>
					eventRegistration.addonPackages?.flatMap(
						(addonPackages) => addonPackages.addons?.map((addon) => addon.title ?? '') ?? []
					) ?? []
			)
		)
	]);

	let selectedStatusValues = $state<string[]>([]);
	let selectedPackageValues = $state<string[]>([]);
	let selectedAddonPackageValues = $state<string[]>([]);
	let selectedAddonValues = $state<string[]>([]);

	let params = queryParameters(
		{
			sort: false,
			page: false,
			limit: ssp.number(10)
		},
		{
			showDefaults: false
		}
	);

	type Data = GetEventRegistrationsOutput['eventRegistrations'][number];

	let columnHelper = createColumnHelper<Data>();

	let rowSelection = $state<RowSelectionState>({});
	let columnVisibility = $state<VisibilityState>({
		addons: false,
		'addon-packages': false
	});
	let columnFilters = $state<ColumnFiltersState>([]);
	let sorting = $state<SortingState>([]);
	let pagination = $state<PaginationState>({ pageIndex: 0, pageSize: 10 });

	// Build columnFilters once into state to keep a stable reference for TanStack memos
	let computedColumnFilters = $state<ColumnFiltersState>([]);
	$effect(() => {
		const next: ColumnFiltersState = [
			...selectedStatusValues.map((value) => ({ id: 'status', value })),
			...selectedPackageValues.map((value) => ({ id: 'package', value })),
			...selectedAddonPackageValues.map((value) => ({ id: 'addon-packages', value })),
			...selectedAddonValues.map((value) => ({ id: 'addons', value }))
		];
		// Only assign when changed to preserve referential equality
		const sameLength = computedColumnFilters.length === next.length;
		const same =
			sameLength &&
			computedColumnFilters.every((f, i) => f.id === next[i].id && f.value === next[i].value);
		if (!same) computedColumnFilters = next;
	});

	const setSorting: OnChangeFn<SortingState> = (updater) => {
		console.log('Setting sorting:', updater);
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}

		if (sorting.length > 0) {
			let firstSort = sorting[0];

			params.sortBy = firstSort.id;
			params.sortDirection = firstSort.desc ? 'desc' : 'asc';
		} else {
			params.sortBy = null;
			params.sortDirection = null;
		}
	};

	let columns = [
		columnHelper.accessor('id', {
			header: ({ table }) =>
				renderSnippet(checkBoxSnippet, {
					checked: table.getIsAllPageRowsSelected(),
					onCheckedChange: (value) => table.toggleAllPageRowsSelected(value),
					indeterminate: table.getIsSomePageRowsSelected() && !table.getIsAllPageRowsSelected(),
					'aria-label': 'Select all'
				}),
			cell: ({ row }) =>
				renderSnippet(checkBoxSnippet, {
					checked: row.getIsSelected(),
					onCheckedChange: (value) => {
						row.toggleSelected(value);
					},
					'aria-label': 'Select row'
				}),
			enableSorting: false,
			enableHiding: false
		}),
		columnHelper.accessor('organization', {
			header() {
				return $_('admin-pages.events.event-registrations.data-table.headers.org');
			},
			cell({ getValue }) {
				return renderComponent(SimpleEventRegistrationOrganization, {
					organization: getValue()
				});
			}
		}),
		columnHelper.accessor(
			({ purchasedPackage }) =>
				purchasedPackage?.name ??
				$_('admin-pages.events.event-registrations.data-table.packages.no-package'),
			{
				id: 'package',
				header: $_('admin-pages.events.event-registrations.data-table.headers.package'),
				filterFn: (row, id, filterValue: string[]) => {
					if (filterValue.length === 0) return true;
					const value = row.getValue<string | null | undefined>(id);
					if (!value) {
						return true;
					}
					return filterValue.includes(value);
				}
			}
		),
		columnHelper.accessor(({ createdAt, modifiedAt }) => modifiedAt ?? createdAt, {
			header: $_('admin-pages.events.event-registrations.data-table.headers.last-modified'),
			cell({ getValue }) {
				return renderComponent(LocalizedDate, {
					date: getValue()
				});
			}
		}),
		columnHelper.accessor('status', {
			id: 'status',
			header: $_('admin-pages.events.event-registrations.data-table.headers.status'),
			cell({ getValue }) {
				return renderComponent(Chip, {
					status: $_(`common.event-registration-status.${getValue()}`),
					variant: getValue()
				});
			},
			enableColumnFilter: true,
			filterFn: (row, id, filterValue: string[]) => {
				if (filterValue.length === 0) return true;
				const value = row.getValue<string | null | undefined>(id);
				if (!value) {
					return true;
				}
				return filterValue.includes(value);
			}
		}),
		columnHelper.accessor('portraitStatus', {
			header: $_('admin-pages.events.event-registrations.data-table.headers.portrait-status'),
			cell({ getValue }) {
				return renderComponent(PortraitStatusIcon, {
					variant: { variant: getValue() ?? 'missing' }
				});
			}
		}),
		columnHelper.accessor(
			({ registrationDocuments }) => {
				const logo = registrationDocuments?.find((document) => document.documentType === 'logo');
				return (
					logo ?? {
						id: '',
						status: 'unreviewed' as const
					}
				);
			},
			{
				id: 'logo',
				header: $_('admin-pages.events.event-registrations.data-table.headers.logo-status'),
				cell({ getValue }) {
					return renderComponent(AdminViewRegistrationDocumentDialog, { logo: getValue() });
				}
			}
		),
		columnHelper.accessor(
			({ registrationDocuments }) => {
				const advert = registrationDocuments?.find(
					(document) => document.documentType === 'advert'
				);
				return (
					advert ?? {
						id: '',
						status: 'unreviewed' as const
					}
				);
			},
			{
				header: $_('admin-pages.events.event-registrations.data-table.headers.advert-status'),
				cell({ getValue }) {
					return renderComponent(AdminViewAdvertisementDialog, { advertisement: getValue() });
				}
			}
		),
		columnHelper.accessor('id', {
			id: 'actions',
			header: '',
			cell({ row }) {
				return renderComponent(DataTableActions, {
					id: row.original.id,
					eventRegistration: row.original,
					onDelete,
					onReject,
					onConfirm
				});
			}
		}),
		columnHelper.accessor(
			({ addonPackages }) => addonPackages?.map((addonPackage) => addonPackage.title) ?? [],
			{
				id: 'addon-packages',
				header: $_('admin-pages.events.event-registrations.data-table.headers.addon-packages'),
				filterFn: (row, id, filterValue: string[]) => {
					if (filterValue.length === 0) return true;
					const value = row.getValue<string | null | undefined>(id);
					if (!value) {
						return true;
					}
					return filterValue.some((filter) => value.includes(filter));
				}
			}
		),
		columnHelper.accessor(
			({ addonPackages }) =>
				addonPackages?.flatMap(
					(addonPackage) => addonPackage.addons?.map((addon) => addon.title) ?? []
				) ?? [],
			{
				id: 'addons',
				header: $_('admin-pages.events.event-registrations.data-table.headers.addons'),
				filterFn: (row, id, filterValue: string[]) => {
					if (filterValue.length === 0) return true;
					const value = row.getValue<string | null | undefined>(id);
					if (!value) {
						return true;
					}
					return filterValue.some((filter) => value.includes(filter));
				}
			}
		)
	];

	const table = createSvelteTable({
		get data() {
			return data;
		},
		get columns() {
			return columns;
		},
		state: {
			get sorting() {
				return sorting;
			},
			get columnVisibility() {
				return columnVisibility;
			},
			get rowSelection() {
				return rowSelection;
			},
			get columnFilters() {
				return computedColumnFilters;
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

	let open = $state(false);

	const counts = $derived({
		package: data.reduce(
			(acc, { purchasedPackage }) => {
				if (purchasedPackage?.name) {
					acc[purchasedPackage.name] = (acc[purchasedPackage.name] || 0) + 1;
				}
				return acc;
			},
			{} as Record<string, number>
		),
		status: data.reduce(
			(acc, { status }) => {
				if (status) {
					acc[status] = (acc[status] || 0) + 1;
				}
				return acc;
			},
			{} as Record<string, number>
		),
		addonPackages: data.reduce(
			(acc, { addonPackages }) => {
				if (addonPackages) {
					addonPackages.forEach((addonPackage) => {
						if (addonPackage.title) {
							acc[addonPackage.title] = (acc[addonPackage.title] || 0) + 1;
						}
					});
				}
				return acc;
			},
			{} as Record<string, number>
		),
		addons: data.reduce(
			(acc, { addonPackages }) => {
				if (addonPackages) {
					addonPackages.forEach((addonPackage) => {
						addonPackage.addons?.forEach((addon) => {
							if (addon.title) {
								acc[addon.title] = (acc[addon.title] || 0) + 1;
							}
						});
					});
				}
				return acc;
			},
			{} as Record<string, number>
		)
	});

	let enableExport = $derived(table.getIsAllRowsSelected() || table.getIsSomeRowsSelected());
	let selectedEventRegistrationIds = $derived(
		table
			.getSelectedRowModel()
			.rows.map((row) => row.original.id)
			.filter(Boolean) as string[]
	);
</script>

{#snippet checkBoxSnippet({
	checked,
	onCheckedChange,
	...props
}: {
	checked: boolean;
	onCheckedChange: (value: boolean) => void;
})}
	<Checkbox {checked} {onCheckedChange} {...props} />
{/snippet}

<section class="flex gap-4 flex-wrap justify-end">
	<SearchInput
		placeholder={$_('common.search')}
		oninput={(e) => table.setGlobalFilter(e.currentTarget.value)}
	/>
	<div class="grow"></div>
	<DataTableFacetedFilter
		title={$_('admin-pages.events.event-registrations.data-table.filters.status')}
		options={status.map((status) => ({
			label: $_('common.event-registration-status.' + status),
			value: status
		}))}
		bind:selectedValues={selectedStatusValues}
		counts={counts.status}
	/>
	<DataTableFacetedFilter
		title={$_('admin-pages.events.event-registrations.data-table.filters.package')}
		options={packages.map((_package) => ({
			label: _package,
			value: _package
		}))}
		bind:selectedValues={selectedPackageValues}
		counts={counts.package}
	/>
	<DataTableFacetedFilter
		counts={counts.addonPackages}
		options={addonPackages.map((addonPackage) => ({
			label: addonPackage,
			value: addonPackage
		}))}
		bind:selectedValues={selectedAddonPackageValues}
		title={$_('admin-pages.events.event-registrations.data-table.filters.addon-packages')}
	/>
	<DataTableFacetedFilter
		options={addons.map((addon) => ({
			label: addon,
			value: addon
		}))}
		bind:selectedValues={selectedAddonValues}
		title={$_('admin-pages.events.event-registrations.data-table.filters.addons')}
		counts={counts.addons}
	/>
	<ExportCatalogueDataDialog
		disabled={!enableExport}
		selectedEventRegistrations={selectedEventRegistrationIds}
	/>
</section>
{#if table && table.getAllLeafColumns().length}
	<section class="mt-10">
		<div class="rounded-md border bg-card border-card shadow shadow-card">
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
								<Table.Cell colspan={columns.length} class="h-24 text-center"
									>No results.</Table.Cell
								>
							</Table.Row>
						{/each}
					{:else}
						{#each { length: params.limit } as _, i}
							<Table.Row>
								{#each columns as column}
									<Table.Cell>
										<Skeleton class="w-full min-h-6" />
									</Table.Cell>
								{/each}
							</Table.Row>
						{/each}
					{/if}
				</Table.Body>
			</Table.Root>
		</div>
	</section>
{/if}
