<script lang="ts">
	import { _ } from '@services';
	import { LocalizedDate, QueryDataTable } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import { Checkbox } from '@/components/ui/checkbox';
	import { createColumnHelper, type Column } from '@tanstack/table-core';
	import DataTableSortToggle from './data-table-sort-toggle.svelte';
	import * as Avatar from '@/components/ui/avatar';
	import { renderSnippet } from '@/@svelte/components/QueryDataTable/render-helpers';
	import type { PagedLegacyOrganizationResponse } from '@api/admin-client';

	type LegacyOrganizations = Exclude<PagedLegacyOrganizationResponse['organizations'], undefined>;

	let {
		organizations,
		totalCount,
		isLoading,
		sortBy = $bindable('name'),
		sortDirection = $bindable('asc'),
		page = $bindable(1),
		limit = $bindable(10)
	}: {
		organizations: LegacyOrganizations;
		totalCount: number;
		isLoading: boolean;
		sortBy?: string;
		sortDirection?: 'asc' | 'desc';
		page?: number;
		limit?: number;
	} = $props();

	const columnHelper = createColumnHelper<LegacyOrganizations[number]>();

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
					name:
						row.original.publicName ??
						row.original.fullName ??
						row.original.name ??
						row.original.shortName ??
						'',
					slug: row.original.id!
				})
		}),
		columnHelper.accessor('contactPeopleCount', {
			id: 'contactPeopleCount',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.legacy-organizations.data-table.headers.contact-people-count`),
						id: 'contactPeopleCount'
					},
					state: column
				}),
			cell: ({ getValue }) => {
				const contactPeopleCount = getValue() || 0;
				return contactPeopleCount;
			}
		}),
		/*columnHelper.accessor('createdAt', {
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
		}),*/
		columnHelper.accessor('id', {
			id: 'actions',
			header() {
				return renderSnippet(emptySnippet);
			},
			cell: ({ row }) =>
				renderSnippet(actionsSnippet, {
					id: row.original.id!
				}),
			enableSorting: false
		})
	];
</script>

{#snippet actionsSnippet({ id }: { id: string })}
	<DataTableActions {id} />
{/snippet}

{#snippet emptySnippet()}{/snippet}

{#snippet sortSnippet({
	column,
	state
}: {
	column: { header: string; id: string };
	state: Column<LegacyOrganizations[number]>;
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
	name = ''
}: {
	slug: string | null;
	name: string | undefined | null;
})}
	<a
		href="/admin/organizations/legacy/{slug}"
		class="hover:underline inline-flex gap-2 items-center align-middle"
	>
		<Avatar.Root class="size-6">
			<Avatar.Fallback
				>{name
					?.split(' ')
					.slice(0, 2)
					.filter(Boolean)
					.map((word) => word[0].toUpperCase())
					.join('')}</Avatar.Fallback
			>
		</Avatar.Root>
		{name}</a
	>
{/snippet}

<QueryDataTable
	data={organizations}
	{totalCount}
	{isLoading}
	{columns}
	bind:sortBy
	bind:sortDirection
	bind:page
	bind:pageSize={limit}
/>
