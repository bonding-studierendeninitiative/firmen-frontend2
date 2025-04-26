<script lang="ts">
	import { createRender, createTable, Render, Subscribe } from 'svelte-headless-table';
	import { derived, type Readable } from 'svelte/store';
	import * as Table from '$lib/components/ui/table';
	import * as Select from '$lib/components/ui/select';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableUserIcon from './data-table-user-icon.svelte';
	import { _ } from '@services';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import ArrowUpDown from 'lucide-svelte/icons/arrow-up-down';
	import { cn } from '@/utils/tailwind';
	import type { OrganizationMembership } from 'svelte-clerk/server';
	import { page } from '$app/stores';

	export let memberResponse: Readable<{ data: OrganizationMembership[]; totalCount: number }>;
	import { LocalizedDate, SearchInput } from '@/@svelte/components';
	import CreateOrgInviteDialog from './create-org-invite-dialog.svelte';
	import QueryDataTable, {
		type ColumnDef
	} from '@/@svelte/components/QueryDataTable/QueryDataTable.svelte';

	let data = derived([memberResponse], ([memberResponse]) => memberResponse.data);
	let totalCount = derived([memberResponse], ([memberResponse]) => memberResponse.totalCount);

	let table = createTable(data, {
		page: addPagination({
			serverSide: true,
			serverItemCount: totalCount,
			initialPageIndex: $page.url.searchParams.get('page')
				? Number($page.url.searchParams.get('page'))
				: undefined,
			initialPageSize: $page.url.searchParams.get('limit')
				? Number($page.url.searchParams.get('limit'))
				: undefined
		}),
		sort: addSortBy({
			serverSide: true
		}),
		filter: addTableFilter({
			serverSide: true,
			initialFilterValue: $page.url.searchParams.get('filter') || undefined,
			fn: ({ filterValue, value }) => value.toLowerCase().includes(filterValue.toLowerCase())
		})
	});

	let columns = [
		{
			id: 'user-profile',
			header: '',
			cell: (row) => ({
				snippet: userIcon,
				props: {
					userName: `${row.publicUserData?.firstName} ${row.publicUserData?.lastName}`,
					src: row.publicUserData?.imageUrl
				}
			})
		},
		{
			accessor: ({ publicUserData }) => publicUserData?.firstName ?? '',
			id: 'first_name',
			header: $_('table-headings.firstName')
		},

		{
			accessor: ({ publicUserData }) => publicUserData?.lastName ?? '',
			id: 'last_name',
			header: $_('table-headings.lastName')
		},

		{
			accessor: ({ publicUserData }) => publicUserData?.identifier,
			id: 'email_address',
			header: $_('table-headings.emailAddress')
		},
		{
			id: 'role',
			header: $_('table-headings.role'),
			cell: (row) => ({
				snippet: userRole,
				props: {
					value: row.role
				}
			})
		},
		{
			id: 'createdAt',
			header: $_('table-headings.joined'),
			cell: (row) => ({
				snippet: localizedDate,
				props: {
					date: row.createdAt
				}
			})
		},
		{
			header: '',
			cell: () => ({
				snippet: actions,
				props: {}
			})
		}
	];
</script>

{#snippet userIcon({ src, userName }: { src: string; userName: string })}
	<DataTableUserIcon {src} {userName} />
{/snippet}

{#snippet userRole({ value }: { value: string })}
	{#if value == 'org:owner'}
		{$_('modules.manage-org-members.owner')}
	{:else if value == 'org:member'}
		{$_('modules.manage-org-members.member')}
	{:else if value == 'org:admin'}
		{$_('modules.manage-org-members.admin')}
	{:else}
		{value}
	{/if}
{/snippet}

{#snippet actions()}
	<DataTableActions />
{/snippet}

{#snippet localizedDate({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}

<div class={cn(`space-y-4`, $$props.class)} {...$$restProps}>
	<div class={cn(`flex items-center justify-between gap-4`)}>
		<SearchInput class="max-w-sm" placeholder={$_('common.search')} type="text" />
		<CreateOrgInviteDialog />
	</div>
	<QueryDataTable {columns} {totalCount} data={$data} />
	<!--<div class="rounded-md border">
		<Table.Root {...$tableAttrs} class="w-full whitespace-no-wrap">
			<Table.Header>
				{#each $headerRows as headerRow}
					<Subscribe rowAttrs={headerRow.attrs()}>
						<Table.Row class=" tracking-wide text-left text-gray-500 border-b bg-gray-50">
							{#each headerRow.cells as cell (cell.id)}
								<Subscribe attrs={cell.attrs()} let:attrs props={cell.props()} let:props>
									<Table.Head {...attrs} class="text-sm font-normal">
										{#if cell.id === 'first_name' || cell.id === 'last_name' || cell.id === 'email_address'}
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
	<div class="flex items-center justify-end space-x-4">
		<div class="min-w-min">
			<Select.Root bind:selected={selectedPageSize} onSelectedChange={(v) => {
				if (v?.value)
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
	</div>-->
</div>
