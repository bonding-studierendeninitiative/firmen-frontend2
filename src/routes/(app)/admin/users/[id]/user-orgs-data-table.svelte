<script lang="ts">
	import { _ } from '@services';
	import { LocalizedDate, QueryDataTable } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import { Checkbox } from '@/components/ui/checkbox';
	import { createColumnHelper, type Column, type ColumnDef } from '@tanstack/table-core';
	import DataTableSortToggle from './data-table-sort-toggle.svelte';
	import * as Avatar from '@/components/ui/avatar';
	import { renderSnippet } from '@/@svelte/components/QueryDataTable/render-helpers';
	import DataTableRoleSwitcher from './data-table-role-switcher.svelte';
	import type { GetOrgMembershipsResponse } from '@/trpc/routers/admin';

	let {
		memberships,
		totalCount,
		isLoading,
		onChangeUserRole
	}: {
		memberships: GetOrgMembershipsResponse;
		totalCount: number;
		isLoading: boolean;
		onChangeUserRole: (orgId: string, role: 'member' | 'owner' | 'admin', memberId: string) => void;
	} = $props();

	const columnHelper = createColumnHelper<GetOrgMembershipsResponse[0]>();

	const columns: ColumnDef<GetOrgMembershipsResponse[0]>[] = $derived([
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
		columnHelper.accessor('organization.name', {
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
					name: row.original.organization.name,
					imageUrl: row.original.organization.logo
				})
		}),
		columnHelper.accessor('role', {
			id: 'role',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.role`),
						id: 'role'
					},
					state: column
				}),
			cell: ({ row, getValue }) =>
				renderSnippet(userRole, {
					orgId: row.original.organizationId,
					value: getValue(),
					memberId: row.original.id
				})
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
				})
		}),
		columnHelper.accessor('id', {
			id: 'actions',
			header: '',
			cell: ({ row }) =>
				renderSnippet(actionsSnippet, {
					slug: row.original.organization.slug
				}),
			enableSorting: false
		})
	]);
</script>

{#snippet actionsSnippet({ slug }: { slug: string })}
	<DataTableActions {slug} />
{/snippet}

{#snippet sortSnippet({
	column,
	state
}: {
	column: { header: string; id: string };
	state: Column<GetOrgMembershipsResponse[0]>;
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
{#snippet userRole({ value, orgId, memberId }: { value: string; orgId: string; memberId: string })}
	<DataTableRoleSwitcher
		{value}
		{orgId}
		onChangeUserRole={(orgId, role) => onChangeUserRole(orgId, role, memberId)}
	/>
{/snippet}
{#snippet localizedDateSnippet({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}
{#snippet orgLinkSnippet({ name, imageUrl }: { name: string; imageUrl?: string })}
	<div class="inline-flex gap-2 items-center align-middle">
		<Avatar.Root class="size-6">
			<Avatar.Image src={imageUrl} alt={name} />
			<Avatar.Fallback
				>{name
					.split(' ')
					.slice(0, 2)
					.map((word) => word[0])
					.join('')}</Avatar.Fallback
			>
		</Avatar.Root>
		{name}
	</div>
{/snippet}

<QueryDataTable data={memberships} {totalCount} {isLoading} {columns} />
