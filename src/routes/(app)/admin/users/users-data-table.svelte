<script lang="ts">
	import { _ } from '@services';
	import { LocalizedDate, QueryDataTable } from '@/@svelte/components';
	import DataTableActions from './data-table-actions.svelte';
	import { Checkbox } from '@/components/ui/checkbox';
	import { createColumnHelper, type Column } from '@tanstack/table-core';
	import DataTableSortToggle from './data-table-sort-toggle.svelte';
	import DataTableRoleSwitcher from './data-table-role-switcher.svelte';
	import { ShieldBan } from '@lucide/svelte';
	import type { UsersResponse } from '@/remote/functions/admin';
	import {
		renderComponent,
		renderSnippet
	} from '@/@svelte/components/QueryDataTable/render-helpers';
	import UserAvatar from '@/components/auth/UserAvatar.svelte';

	let {
		users,
		totalCount,
		isLoading,
		params
	}: {
		users: UsersResponse['data'];
		totalCount: number;
		isLoading: boolean;
		params: {
			sortBy: string;
			sortDirection: 'asc' | 'desc';
			page: number;
			limit: number;
		};
	} = $props();

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
					name: row.original.name ?? 'Unbekannter Nutzer',
					userId: row.original.id
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
					value: getValue() ?? 'Keine Rolle'
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
{#snippet userRole({ value, userId }: { value: string; userId: string })}
	<DataTableRoleSwitcher {value} {userId} />
{/snippet}
{#snippet localizedDateSnippet({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}
{#snippet banned()}
	<ShieldBan />
{/snippet}
{#snippet userLinkSnippet({ userId, name }: { userId: string; name: string })}
	<a
		href="/admin/users/{userId}"
		class="hover:underline inline-flex gap-2 items-center align-middle"
	>
		<UserAvatar user={{ id: userId, name }} />
		{name}</a
	>
{/snippet}

<QueryDataTable
	data={users}
	{totalCount}
	{isLoading}
	{columns}
	bind:page={params.page}
	bind:pageSize={params.limit}
	bind:sortBy={params.sortBy}
	bind:sortDirection={params.sortDirection}
/>
