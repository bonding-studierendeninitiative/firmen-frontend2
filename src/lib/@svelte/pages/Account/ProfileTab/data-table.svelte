<script lang="ts">
	import type { GetOrgMembersResponse } from '@schema';
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { readable, writable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import DataTableActions from './data-table-actions.svelte';
	import { _ } from '@services';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { Button } from '$lib/components/ui/button';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import { Input } from '$lib/components/ui/input';

	export let inviteMemberDialogOpen;
	export let memberResponse: GetOrgMembersResponse;

	const table = createTable(readable(memberResponse.members), {
		page: addPagination({
			serverSide: true,
			serverItemCount: writable(memberResponse.totalElements)
		}),
		sort: addSortBy(),
		filter: addTableFilter({
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	const columns = table.createColumns([
		table.column({
			accessor: 'contactPersonName',
			header: $_('table-headings.name')
		}),
		table.column({
			accessor: 'email',
			header: 'Mail'
		}),
		table.column({
			accessor: 'membershipType',
			header: $_('table-headings.role'),
			cell: ({ value }) => {
				if (value == 'OWNER') {
					return $_('user-pages.accounts.owner');
				} else if (value == 'MEMBER') {
					return $_('user-pages.accounts.member');
				} else if (value == 'ADMIN') {
					return $_('user-pages.accounts.admin');
				} else {
					return value;
				}
			}
		}),
		table.column({
			accessor: ({ contactPersonId }) => contactPersonId,
			header: '',
			cell: ({ value }) => {
				return createRender(DataTableActions, { id: value });
			},
			plugins: {
				sort: {
					disable: true
				},
				filter: {
					exclude: true
				}
			}
		})
	]);

	const { headerRows, pageRows, tableAttrs, tableBodyAttrs, pluginStates } =
		table.createViewModel(columns);
	const { hasNextPage, hasPreviousPage, pageIndex } = pluginStates.page;
	const { filterValue } = pluginStates.filter;
</script>

<div>
	<div class="flex items-center justify-between py-4">
		<Input
			class="max-w-sm"
			placeholder={$_('common.search')}
			type="text"
			bind:value={$filterValue}
		/>
		<Button variant="outline" on:click={() => (inviteMemberDialogOpen = true)}
			>{$_('user-pages.accounts.invite')}</Button
		>
	</div>
	<div class="rounded-md border">
		<Table.Root {...$tableAttrs} class="w-full whitespace-no-wrap">
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row class=" tracking-wide text-left text-gray-500 border-b bg-gray-50">
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="text-sm font-normal">
										{#if cell.id === 'contactPersonName' || cell.id === 'membershipType' || cell.id === 'email'}
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
			<Table.Body {...$tableBodyAttrs} class="bg-white divide-y">
				{#each $pageRows as row (row.id)}
					<Subscribe rowAttrs={row.attrs()} let:rowAttrs>
						<Table.Row {...rowAttrs}>
							{#each row.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs>
									<Table.Cell {...attrs}>
										{#if cell.id !== 'contactPersonName' && cell.id !== 'membershipType' && cell.id !== 'email'}
											<div class="pr-0 mr-0 flex justify-end">
												<Render of={cell.render()} />
											</div>
										{:else}
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
			disabled={!$hasPreviousPage}
			>Previous
		</Button>
		<Button
			variant="outline"
			size="sm"
			disabled={!$hasNextPage}
			on:click={() => ($pageIndex = $pageIndex + 1)}
			>Next
		</Button>
	</div>
</div>
