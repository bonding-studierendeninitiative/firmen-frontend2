<script lang="ts">
	import type { GetEventRegistrationsForOrganizationResponse } from '@schema';
	import { addPagination } from 'svelte-headless-table/plugins';
	import { readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import { AdvertStatusIcon, Chip, LocalizedDateRange, LocalizedDate, LogoStatusIcon, PortraitStatusIcon } from '@/@svelte/components';
	import { _ } from '@services';
	import { Button } from '$lib/components/ui/button';
	import { writable } from 'svelte/store';
	import DataTableActions from './data-table-actions.svelte';
	import type { InferOutput } from 'valibot';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';

	export let eventRegistrations: InferOutput<GetEventRegistrationsForOrganizationResponse>;
	let currentServerItemCount = writable(eventRegistrations.totalElements);

	$: {
		currentServerItemCount.set(eventRegistrations.totalElements);
	}

	const table = createTable(readable(eventRegistrations.eventRegistrations), {
		page: addPagination({
			serverSide: true,
			serverItemCount: currentServerItemCount
		})
	});


	const columns = table.createColumns([
		table.column({
			accessor: ({ event }) => event.name,
			header: $_('user-pages.dashboard.event')
		}),
		table.column({
			accessor: ({ event }) => event.projectHSG,
			header: $_('user-pages.dashboard.hsg')
		}),
		table.column({
			accessor: ({ event }) => event.dateTo ? [event.dateFrom , event.dateTo] : event.dateFrom,
			header: $_('user-pages.dashboard.date'),
			cell: ({ value }) => {
				if (Array.isArray(value)) {
					return createRender(LocalizedDateRange, {dateFrom: value[0], dateTo: value[1], format: "dd L", hoverFormat: "medium"})
				} else {
					return createRender(LocalizedDate, {date: value, format: "dd L", hoverFormat: "medium"})
				}
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ status }) => status,
			header: 'Status',
			cell: ({ value }) => {
				return createRender(Chip, { status: $_(`status-text.${value}`), variant: value });
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
			accessor: ({ portraitStatus }) => portraitStatus,
			cell: ({ value }) => createRender(PortraitStatusIcon, { variant: value, title: $_(`status-text.${value}`) }),
			header: 'Portrait',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ logoStatus }) => logoStatus,
			cell: ({ value }) => createRender(LogoStatusIcon, { variant: value, title: $_(`status-text.${value}`)  }),
			header: 'Logo',
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: ({ advertisementStatus }) => advertisementStatus,
			cell: ({ value }) => createRender(AdvertStatusIcon, { variant: value, title: $_(`status-text.${value}`)  }),
			header: $_('user-pages.dashboard.advert'),
			plugins: {
				filter: {
					exclude: true
				}
			}
		}),
		table.column({
			accessor: (item) => item.id,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, {
					id: value
				});
			},
			plugins: {
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } = table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
</script>
<div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs}>
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row>
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()}>
									<Table.Head {...attrs}>
										{#if cell.id === "Status"}
											<div class="text-center">
												<Render of={cell.render()} />
											</div>
										{:else }
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
										{#if cell.id === $_('user-pages.dashboard.event')}
											<a href="#" class="hover:underline">
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
	<div class="flex items-center justify-end space-x-4 py-4">
		<Button
			variant="outline"
			size="sm"
			on:click={() => ($pageIndex = $pageIndex - 1)}
			disabled={!$hasPreviousPage}>Previous
		</Button
		>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}>Next
		</Button
		>
	</div>
</div>