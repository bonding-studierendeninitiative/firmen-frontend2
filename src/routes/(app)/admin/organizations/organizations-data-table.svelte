<script lang="ts">
	import { _ } from '@services';
	import type { AdminOrgsOutput } from '@/trpc/client';
	import { LocalizedDate } from '@/@svelte/components';
	import DataTable from './data-table.svelte';
	import type { ColumnDef } from './data-table.svelte';
	import type { Readable } from 'svelte/store';
	import DataTableCheckbox from './data-table-checkbox.svelte';
	import DataTableActions from './data-table-actions.svelte';

	export let organizations: AdminOrgsOutput['data'];
	export let totalCount: Readable<number>;
	export let isLoading: boolean;

    let checked: Record<string, boolean> = {}

	const columns: ColumnDef<AdminOrgsOutput['data'][0]>[] = [
		{
			id: 'checkboxes',
			header: (row) => ({snippet: checkBoxSnippet, props: {
                checked: row.totalRows == row.selectedRows.size
            }}),
			cell: (row) => ({snippet: checkBoxSnippet, props: {
                checked: checked[row.id]
            }}),
            sortable: false
		},
		{
			id: 'name',
			header: $_(`admin-pages.organizations.data-table.headers.name`),
			cell: (row) => ({snippet: orgLinkSnippet, props: {
                name: row.name,
                slug: row.slug
            }})
		},
		{
			id: 'members_count',
			header: $_(`admin-pages.organizations.data-table.headers.members-count`),
			accessor: (row) => row.membersCount || 0,
			align: 'right'
		},
		{
			id: 'created_at',
			header: $_(`admin-pages.organizations.data-table.headers.last-modified`),
			cell: (row) => ({snippet: localizedDateSnippet, props: {
                date: row.createdAt
            }})
		},
		{
			id: 'organizationType',
			header: $_(`admin-pages.organizations.data-table.headers.type`),
			cell: (row) => ({snippet: orgTypeSnippet, props: {
                type: row.publicMetadata?.type
            }}),
			sortable: false
		},
		{
			id: 'actions',
			header: '',
			cell: (row) => ({snippet: actionsSnippet, props: {
                id: row.id
            }}),
			sortable: false
		}
	];
</script>

{#snippet actionsSnippet({id}: {id: string})}
	<DataTableActions {id} />
{/snippet}

{#snippet checkBoxSnippet({checked}: {checked: boolean | "indeterminate"})}
	<DataTableCheckbox {checked} />
{/snippet}
{#snippet localizedDateSnippet(date)}
	<LocalizedDate {date} />
{/snippet}
{#snippet orgLinkSnippet({slug, name}: {slug: string, name: string})}
    <a href="/admin/organizations/{slug}" class="hover:underline">{name}</a>
{/snippet}
{#snippet orgTypeSnippet({type}: {type: string | undefined})}
{#if (type) }
    {$_(`common.org-types.${type}`)}
{:else}
    {''}
{/if}
{/snippet}

<DataTable
	data={organizations}
	{totalCount}
	{isLoading}
	{columns}
	onRowClick={(row) => {
		window.location.href = `/admin/organizations/${row.slug}`;
	}}
/>
