<script lang="ts">
	import { _ } from '@services';
	import type { AdminOrgsOutput } from '@/trpc/client';
	import { LocalizedDate, QueryDataTable } from '@/@svelte/components';
	import type { Readable } from 'svelte/store';
	import DataTableActions from './data-table-actions.svelte';
	import { Checkbox } from '@/components/ui/checkbox';
	import { createColumnHelper, type Column, type ColumnDef } from '@tanstack/svelte-table';
	import DataTableSortToggle from './data-table-sort-toggle.svelte';
	import * as Avatar from '@/components/ui/avatar';
	import { renderSnippet } from '@/@svelte/components/QueryDataTable/render-helpers';

	let { organizations, totalCount, isLoading }: { organizations: AdminOrgsOutput['data']; totalCount: Readable<number>; isLoading: boolean } = $props();

	const columnHelper = createColumnHelper<AdminOrgsOutput['data'][0]>();

	const columns: ColumnDef<AdminOrgsOutput['data'][0]>[] = $derived([
		columnHelper.accessor('id', {
			id: 'checkboxes',
			header: ({ table }) =>
				renderSnippet(checkBoxSnippet, {
					checked: table.getIsAllRowsSelected()
						? true
						: table.getIsSomeRowsSelected()
							? 'indeterminate'
							: false,
					onCheckedChange: () => {
						table.toggleAllRowsSelected();
					}
				}),
			cell: ({ row }) => {
				return renderSnippet(checkBoxSnippet, {
					checked: row.getIsSelected(),
					onCheckedChange: () => {
						row.toggleSelected();
					}
				});
			},
			enableSorting: false
		}),
		columnHelper.accessor('name', {
			id: 'name',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.name`),
						id: 'name'
					},
					state: column
				}),
			cell: ({ row }) =>
				renderSnippet(orgLinkSnippet, {
					name: row.original.name,
					slug: row.original.slug,
					imageUrl: row.original.imageUrl
				})
		}),
		columnHelper.accessor('membersCount', {
			id: 'members_count',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.members-count`),
						id: 'members_count'
					},
					state: column
				}),
		}),
		columnHelper.accessor('createdAt', {
			id: 'created_at',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.last-modified`),
						id: 'created_at'
					},
					state: column
				}),
			cell: ({ row }) =>
				renderSnippet(localizedDateSnippet, {
					date: row.original.createdAt
				}),
		}),
		columnHelper.accessor('publicMetadata.type', {
			id: 'organizationType',
			header: $_(`admin-pages.organizations.data-table.headers.type`),
			cell: ({ row }) =>
				renderSnippet(orgTypeSnippet, {
					type: row.original.publicMetadata?.type ?? ""
				}),
			enableSorting: false
		}),
		columnHelper.accessor('id', {
			id: 'actions',
			header: '',
			cell: ({ row }) =>
				renderSnippet(actionsSnippet, {
					id: row.original.id
				}
			),
			enableSorting: false
		})
	]);
</script>

{#snippet actionsSnippet({ id }: { id: string })}
	<DataTableActions {id} />
{/snippet}

{#snippet sortSnippet({
	column,
	state
}: {
	column: { header: string; id: string };
	state: Column<AdminOrgsOutput['data'][0]>
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
	<a
		href="/admin/organizations/{slug}"
		class="hover:underline inline-flex gap-2 items-center align-middle"
	>
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
