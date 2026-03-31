<script lang="ts">
	import { _ } from '@services';
	import { LocalizedDate, QueryDataTable } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import { Checkbox } from '@/components/ui/checkbox';
	import { createColumnHelper, type Column } from '@tanstack/table-core';
	import DataTableSortToggle from './data-table-sort-toggle.svelte';
	import * as Avatar from '@/components/ui/avatar';
	import { renderSnippet } from '@/@svelte/components/QueryDataTable/render-helpers';
	import type { OrganizationsResponse } from '@/remote/functions/admin';

	let {
		organizations,
		totalCount,
		isLoading,
		params
	}: {
		organizations: OrganizationsResponse['data'];
		totalCount: number;
		isLoading: boolean;
		params: {
			sortBy: string;
			sortDirection: 'asc' | 'desc';
			page: number;
			limit: number;
		};
	} = $props();

	const columnHelper = createColumnHelper<OrganizationsResponse['data'][0]>();

	const columns = [
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
					imageUrl: row.original.logo
				})
		}),
		columnHelper.accessor('members', {
			id: 'members',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.members-count`),
						id: 'members'
					},
					state: column
				}),
			cell: ({ getValue }) => {
				return renderSnippet(textSnippet, {
					text: (getValue()?.length || 0).toString()
				});
			}
		}),
		columnHelper.accessor('createdAt', {
			id: 'createdAt',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.last-modified`),
						id: 'createdAt'
					},
					state: column
				}),
			cell: ({ row }) =>
				renderSnippet(localizedDateSnippet, {
					date: row.original.createdAt
				})
		}),
		columnHelper.accessor('id', {
			id: 'actions',
			cell: ({ row }) =>
				renderSnippet(actionsSnippet, {
					id: row.original.id
				}),
			enableSorting: false
		})
	];
</script>

{#snippet actionsSnippet({ id }: { id: string })}
	<DataTableActions {id} />
{/snippet}

{#snippet textSnippet({ text }: { text: string })}
	<span>{text}</span>
{/snippet}

{#snippet sortSnippet({
	column,
	state
}: {
	column: { header: string; id: string };
	state: Column<OrganizationsResponse['data'][0]>;
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
	<Checkbox checked={!!checked} indeterminate={checked === 'indeterminate'} {onCheckedChange} />
{/snippet}
{#snippet localizedDateSnippet({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}
{#snippet orgLinkSnippet({
	slug,
	name = '',
	imageUrl
}: {
	slug: string | null;
	name: string | undefined | null;
	imageUrl: string | null | undefined;
})}
	<a
		href="/admin/organizations/{slug}"
		class="hover:underline inline-flex gap-2 items-center align-middle"
	>
		<Avatar.Root class="size-6">
			<Avatar.Image src={imageUrl} alt={name} />
			<Avatar.Fallback
				>{name
					?.split(' ')
					.slice(0, 2)
					.map((word) => word[0].toUpperCase())
					.join('')}</Avatar.Fallback
			>
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

<QueryDataTable
	data={organizations}
	{totalCount}
	{isLoading}
	{columns}
	bind:page={params.page}
	bind:pageSize={params.limit}
	bind:sortBy={params.sortBy}
	bind:sortDirection={params.sortDirection}
/>
