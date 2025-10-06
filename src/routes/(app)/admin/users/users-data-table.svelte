<script lang="ts">
	import { _ } from '@services';
	import { LocalizedDate, QueryDataTable } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import { Checkbox } from '@/components/ui/checkbox';
	import { createColumnHelper, type Column } from '@tanstack/table-core';
	import DataTableSortToggle from './data-table-sort-toggle.svelte';
	import * as Avatar from '@/components/ui/avatar';
	import DataTableRoleSwitcher from './data-table-role-switcher.svelte';
	import { ShieldBan } from '@lucide/svelte';
	import type { UsersResponse } from '@/remote/functions/admin';
	import {
		renderComponent,
		renderSnippet
	} from '@/@svelte/components/QueryDataTable/render-helpers';

	let {
		users,
		totalCount,
		isLoading,
		params
	}: { users: UsersResponse['data']; totalCount: number; isLoading: boolean; params: any } =
		$props();

	const columnHelper = createColumnHelper<UsersResponse['data'][0]>();

	const columns = [
		columnHelper.accessor('id', {
			id: 'checkboxes',
			header: ({ table }) =>
				renderComponent(Checkbox, {
					checked: table?.getIsAllPageRowsSelected(),
					onCheckedChange: (value) => table?.toggleAllPageRowsSelected(value),
					indeterminate: table?.getIsSomePageRowsSelected() && !table?.getIsAllPageRowsSelected(),
					'aria-label': 'Select all'
				}),
			cell: ({ row }) =>
				renderComponent(Checkbox, {
					checked: row.getIsSelected(),
					onCheckedChange: (value) => row.toggleSelected(value),
					'aria-label': 'Select row'
				}),
			enableSorting: false,
			enableHiding: false
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
				renderSnippet(userLinkSnippet, {
					name: row.original.name,
					userId: row.original.id,
					imageUrl: row.original.image
				})
		}),
		columnHelper.accessor('email', {
			id: 'email',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.organizations.data-table.headers.email`),
						id: 'email'
					},
					state: column
				}),
			cell: ({ getValue }) => {
				const email = getValue();
				return email;
			}
		}),
		columnHelper.accessor('role', {
			id: 'role',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.users.data-table.headers.role`),
						id: 'role'
					},
					state: column
				}),
			cell: ({ row, getValue }) =>
				renderSnippet(userRole, {
					userId: row.original.id,
					value: getValue()
				})
		}),
		columnHelper.accessor('createdAt', {
			id: 'createdAt',
			header: ({ column }) =>
				renderSnippet(sortSnippet, {
					column: {
						header: $_(`admin-pages.users.data-table.headers.created-at`),
						id: 'createdAt'
					},
					state: column
				}),
			cell: ({ row }) =>
				renderSnippet(localizedDateSnippet, {
					date: row.original.createdAt
				})
		}),
		columnHelper.accessor('banned', {
			id: 'banned',
			header: '',
			cell: ({ getValue }) => (getValue() ? renderSnippet(banned, {}) : null),
			enableSorting: false
		}),
		columnHelper.accessor('id', {
			id: 'actions',
			header: '',
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

{#snippet sortSnippet({
	column,
	state
}: {
	column: { header: string; id: string };
	state: Column<UsersResponse['data'][0]>;
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
{#snippet userRole({ value, userId }: { value: string; userId: string; orgId: string })}
	<DataTableRoleSwitcher {value} {userId} />
{/snippet}
{#snippet localizedDateSnippet({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}
{#snippet banned()}
	<ShieldBan />
{/snippet}
{#snippet userLinkSnippet({
	userId,
	name,
	imageUrl
}: {
	userId: string;
	name: string;
	imageUrl?: string;
})}
	<a
		href="/admin/users/{userId}"
		class="hover:underline inline-flex gap-2 items-center align-middle"
	>
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
		{name}</a
	>
{/snippet}

<QueryDataTable data={users} {totalCount} {isLoading} {columns} {params} />
