<script lang="ts">
	import { _ } from '@services';
	import type { AdminOrgsOutput } from '@/trpc/client';
	import { LocalizedDate, QueryDataTable } from '@/@svelte/components';
	import type { Readable } from 'svelte/store';
	import DataTableActions from './data-table-actions.svelte';
	import { Checkbox } from '@/components/ui/checkbox';
	import type { ColumnDef } from '@/@svelte/components/QueryDataTable/QueryDataTable.svelte';
	import DataTableSortToggle from './data-table-sort-toggle.svelte';
	import { type TableState } from '@/@svelte/components/QueryDataTable/table-state.svelte';
	import * as Avatar from '@/components/ui/avatar';

	export let organizations: AdminOrgsOutput['data'];
	export let totalCount: Readable<number>;
	export let isLoading: boolean;

	const columns: ColumnDef<AdminOrgsOutput['data'][0]>[] = [
		{
			id: 'checkboxes',
			header: (state) => ({
				snippet: checkBoxSnippet,
				props: {
					checked: state.areAllRowsSelected
						? true
						: state.areSomeRowsSelected
							? 'indeterminate'
							: false,
					onCheckedChange: () => {
						state.onToggleAllRowsSelection();
					}
				}
			}),
			cell: (row, state) => ({
				snippet: checkBoxSnippet,
				props: {
					checked: state.isRowSelected(row),
					onCheckedChange: () => {
						state.onToggleRowSelection(row);
					}
				}
			}),
			sortable: false
		},
		{
			id: 'name',
			header: (state) => ({
				snippet: sortSnippet,
				props: {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.name`),
						id: 'name'
					},
					state
				}
			}),
			cell: (row) => ({
				snippet: orgLinkSnippet,
				props: {
					name: row.name,
					slug: row.slug,
					imageUrl: row.imageUrl
				}
			})
		},
		{
			id: 'members_count',
			header: (state) => ({
				snippet: sortSnippet,
				props: {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.members-count`),
						id: 'members_count'
					},
					state
				}
			}),
			accessor: (row) => row.membersCount || 0,
			align: 'right'
		},
		{
			id: 'created_at',
			header: (state) => ({
				snippet: sortSnippet,
				props: {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.last-modified`),
						id: 'created_at'
					},
					state
				}
			}),
			cell: (row) => ({
				snippet: localizedDateSnippet,
				props: {
					date: row.createdAt
				}
			})
		},
		{
			id: 'organizationType',
			header: $_(`admin-pages.organizations.data-table.headers.type`),
			cell: (row) => ({
				snippet: orgTypeSnippet,
				props: {
					type: row.publicMetadata?.type
				}
			}),
			sortable: false
		},
		{
			id: 'actions',
			header: '',
			cell: (row) => ({
				snippet: actionsSnippet,
				props: {
					id: row.id
				}
			}),
			sortable: false
		}
	];
</script>

{#snippet actionsSnippet({ id }: { id: string })}
	<DataTableActions {id} />
{/snippet}

{#snippet sortSnippet({
	column,
	state
}: {
	column: { header: string; id: string };
	state: TableState<unknown>;
})}
	<DataTableSortToggle {column} {state} />
{/snippet}

{#snippet checkBoxSnippet({
	checked,
	onCheckedChange
}: {
	checked: boolean | 'indeterminate';
	onCheckedChange: () => void;
})}
	<Checkbox {checked} {onCheckedChange} />
{/snippet}
{#snippet localizedDateSnippet({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}
{#snippet orgLinkSnippet({
	slug,
	name,
	imageUrl
}: {
	slug: string;
	name: string;
	imageUrl: string;
})}
	<a href="/admin/organizations/{slug}" class="hover:underline inline-flex gap-2 items-center align-middle">
		<Avatar.Root class="w-6 h-6">
			<Avatar.Image src={imageUrl} alt={name} />
			<Avatar.Fallback>{name}</Avatar.Fallback>
		</Avatar.Root>
		{name}</a
	>
{/snippet}
{#snippet orgTypeSnippet({ type }: { type: string | undefined })}
	{#if type}
		{$_(`common.org-types.${type}`)}
	{:else}
		{''}
	{/if}
{/snippet}

<QueryDataTable data={organizations} {totalCount} {isLoading} {columns} />
