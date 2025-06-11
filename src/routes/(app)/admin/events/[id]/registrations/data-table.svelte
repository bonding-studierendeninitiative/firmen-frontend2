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
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import ExportCatalogueDataDialog from './export-catalogue-data-form.svelte';
	import SimpleEventRegistrationOrganization from './simple-event-registration-organization.svelte';
	import CreateEventRegistrationForm from './create-event-registration-form.svelte';
	import { AdminViewAdvertisementDialog, AdminViewLogoDialog } from '@/@svelte/modules';
	import type { EventRegistrationsForEventOutput } from '@/trpc/client';
	import {
		createColumnHelper,
		createSvelteTable,
		getCoreRowModel,
		getFilteredRowModel,
		type TableOptions,
		type ColumnDef
	} from '@tanstack/svelte-table';
	import { renderComponent } from '@/@svelte/components/QueryDataTable/render-helpers';
	import { queryParameters } from 'sveltekit-search-params';
	import FlexRender from '@/@svelte/components/QueryDataTable/flex-render.svelte';
	import { Skeleton } from '@/components/ui/skeleton';

	let {
		data,
		isLoading
	}: { data: EventRegistrationsForEventOutput['eventRegistrations']; isLoading: boolean } =
		$props();

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

	let params = queryParameters({
		sort: false,
		page: false,
		limit: false
	});

	type Data = EventRegistrationsForEventOutput['eventRegistrations'][number];

	let columnHelper = createColumnHelper<Data>();

	let columns: ColumnDef<Data>[] = $derived([
		columnHelper.accessor('id', {
			header({ table }) {
				return renderComponent(DataTableCheckbox, {
					checked: table.getIsAllPageRowsSelected()
						? true
						: table.getIsSomePageRowsSelected()
							? 'indeterminate'
							: false,
					onCheckedChange: () => table.toggleAllPageRowsSelected()
				});
			},
			cell({ row }) {
				return renderComponent(DataTableCheckbox, {
					checked: row.getIsSelected(),
					onCheckedChange: () => row.toggleSelected()
				});
			},
			enableColumnFilter: false,
			enableGlobalFilter: false
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
					const value = row.getValue(id);
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
			filterFn: (row, id, filterValue: string[]) => {
				if (filterValue.length === 0) return true;
				const value = row.getValue(id);
				return filterValue.includes(value);
			}
		}),
		columnHelper.accessor('portraitStatus', {
			header: $_('admin-pages.events.event-registrations.data-table.headers.portrait-status'),
			cell({ getValue }) {
				return renderComponent(PortraitStatusIcon, { variant: getValue() ?? '' });
			}
		}),
		columnHelper.accessor('logo', {
			header: $_('admin-pages.events.event-registrations.data-table.headers.logo-status'),
			cell({ getValue }) {
				return renderComponent(AdminViewLogoDialog, { logo: getValue() });
			}
		}),
		columnHelper.accessor('advertisement', {
			header: $_('admin-pages.events.event-registrations.data-table.headers.advert-status'),
			cell({ getValue }) {
				return renderComponent(AdminViewAdvertisementDialog, { advertisement: getValue() });
			}
		}),
		columnHelper.accessor('id', {
			id: 'actions',
			header: '',
			cell({ row }) {
				return renderComponent(DataTableActions, {
					id: row.original.id,
					eventRegistration: row.original
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
					const value = row.getValue(id);
					return filterValue.some((filter) => value.includes(filter));
				}
			}
		),
		columnHelper.accessor(
			({ addonPackages }) =>
				addonPackages?.flatMap((addonPackage) => addonPackage.addons?.map((addon) => addon.title) ?? []) ?? [],
			{
				id: 'addons',
				header: $_('admin-pages.events.event-registrations.data-table.headers.addons'),
				filterFn: (row, id, filterValue: string[]) => {
					if (filterValue.length === 0) return true;
					const value = row.getValue(id);
					return filterValue.some((filter) => value.includes(filter));
				}
			}
		)
	]);

	let rowSelection = $state({})

	let options: TableOptions<Data> = $derived({
		data,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		columns,
		getRowId: (original) => original.id,
		state: {
			columnFilters: [],
			rowSelection
		},
		onRowSelectionChange: (updater) => {
			if (updater instanceof Function) {
				rowSelection = updater(rowSelection)
			} else {
				rowSelection = updater
			}
		},
		initialState: {
			columnVisibility: {
				addons: false,
				"addon-packages": false
			}
		}
	});

	let table = $derived(createSvelteTable(options));

	let open = $state(false);

	const counts = $derived({
		package: data.reduce((acc, { purchasedPackage }) => {
			if (purchasedPackage?.name) {
				acc[purchasedPackage.name] = (acc[purchasedPackage.name] || 0) + 1;
			}
			return acc;
		}, {} as Record<string, number>),
		status: data.reduce((acc, { status }) => {
			if (status) {
				acc[status] = (acc[status] || 0) + 1;
			}
			return acc;
		}, {} as Record<string, number>),
		addonPackages: data.reduce((acc, { addonPackages }) => {
			if (addonPackages) {
				addonPackages
					.filter((addonPackage) => addonPackage.title)
					.forEach((addonPackage) => {
						acc[addonPackage.title] = (acc[addonPackage.title] || 0) + 1;
					});
			}
			return acc;
		}, {} as Record<string, number>),
		addons: data.reduce((acc, { addonPackages }) => {
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
		}, {} as Record<string, number>)
	});

	let enableExport = $derived($table.getIsAllRowsSelected() || $table.getIsSomeRowsSelected());
	let selectedEventRegistrationIds = $derived(
		$table.getSelectedRowModel().rows.map((row) => row.original.id)
	);
</script>

<section class="flex gap-4 flex-wrap justify-end">
	<SearchInput 
		placeholder={$_('common.search')} 
		on:input={(e) => $table.setGlobalFilter(e.currentTarget.value)} 
	/>
	<div class="flex-grow"></div>
	<DataTableFacetedFilter
		title={$_('admin-pages.events.event-registrations.data-table.filters.status')}
		options={status.map((status) => ({
			label: $_('common.event-registration-status.' + status),
			value: status
		}))}
		on:filterChange={(e) => {
			$table.getColumn('status')?.setFilterValue(e.detail);
		}}
		counts={counts.status}
	/>
	<DataTableFacetedFilter
		title={$_('admin-pages.events.event-registrations.data-table.filters.package')}
		options={packages.map((_package) => ({
			label: _package,
			value: _package
		}))}
		on:filterChange={(e) => {
			$table.getColumn('package')?.setFilterValue(e.detail);
		}}
		counts={counts.package}
	/>
	<DataTableFacetedFilter
		counts={counts.addonPackages}
		options={addonPackages.map((addonPackage) => ({
			label: addonPackage,
			value: addonPackage
		}))}
		on:filterChange={(e) => {
			$table.getColumn('addon-packages')?.setFilterValue(e.detail);
		}}
		title={$_('admin-pages.events.event-registrations.data-table.filters.addon-packages')}
	/>
	<DataTableFacetedFilter
		options={addons.map((addon) => ({
			label: addon,
			value: addon
		}))}
		on:filterChange={(e) => {
			$table.getColumn('addons')?.setFilterValue(e.detail);
		}}
		title={$_('admin-pages.events.event-registrations.data-table.filters.addons')}
		counts={counts.addons}
	/>
	<ExportCatalogueDataDialog
		disabled={!enableExport}
		selectedEventRegistrations={selectedEventRegistrationIds}
	/>
	<CreateEventRegistrationForm bind:open />
</section>
<section class="mt-10">
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
									<Skeleton class="w-full min-w-6 h-6" />
								</Table.Cell>
							{/each}
						</Table.Row>
					{/each}
				{/if}
			</Table.Body>
		</Table.Root>
	</div>
</section>
