<script lang="ts">
	import { derived, type Readable } from 'svelte/store';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableUserIcon from './data-table-user-icon.svelte';
	import { _ } from '@services';
	import { cn } from '@/utils/ui';
	import { LocalizedDate, SearchInput, QueryDataTable } from '@/@svelte/components';
	import CreateOrgInviteDialog from './create-org-invite-dialog.svelte';
	import DataTableRoleSwitcher from './data-table-role-switcher.svelte';
	import { createColumnHelper } from '@tanstack/table-core';
	import { renderSnippet } from '@/@svelte/components/QueryDataTable/render-helpers';

	type Data = {
		user: {
			id: string;
			email: string;
			name: string | null;
			image: string | null;
		};
		role: string;
		createdAt: Date;
		id: string;
		userId: string;
		organizationId: string;
	};
	interface Props {
		memberResponse: Readable<Data[]>;
		organizationId: string;
		class?: string;
		onChangeUserRole?: (
			userId: string,
			role: 'admin' | 'member' | 'owner',
			organizationId: string
		) => void;
		[key: string]: any;
		onRemoveMember?: (userId: string, organizationId: string) => void;
	}

	let {
		memberResponse,
		organizationId,
		class: className = '',
		onChangeUserRole,
		onRemoveMember,
		...rest
	}: Props = $props();

	let data = derived([memberResponse], ([memberResponse]) => memberResponse);

	let columnHelper = createColumnHelper<Data>();

	let columns = [
		columnHelper.accessor('user', {
			id: 'user-profile',
			header: '',
			cell: ({ getValue }) =>
				renderSnippet(userIcon, {
					userName: `${getValue()?.name}`,
					src: getValue()?.image
				})
		}),
		columnHelper.accessor('user.name', {
			header: $_('table-headings.name'),
			cell: ({ getValue }) => getValue()
		}),
		columnHelper.accessor('user.email', {
			header: $_('table-headings.email'),
			cell: ({ getValue }) => getValue()
		}),
		columnHelper.accessor('role', {
			header: $_('table-headings.role'),
			cell: ({ row, getValue }) =>
				renderSnippet(userRole, {
					value: getValue(),
					orgId: row.original.organizationId,
					userId: row.original.id
				})
		}),
		columnHelper.accessor('createdAt', {
			id: 'createdAt',
			header: $_('table-headings.joined'),
			cell: ({ getValue }) =>
				renderSnippet(localizedDate, {
					date: getValue()
				})
		}),
		columnHelper.accessor('userId', {
			header: '',
			cell: ({ row, getValue }) =>
				renderSnippet(actions, {
					id: getValue(),
					orgId: row.original.organizationId
				})
		})
	];
</script>

{#snippet userIcon({ src, userName }: { src: string; userName: string })}
	<DataTableUserIcon {src} {userName} />
{/snippet}

{#snippet userRole({ value, userId }: { value: string; userId: string; orgId: string })}
	<DataTableRoleSwitcher {value} {organizationId} {userId} {onChangeUserRole} />
{/snippet}

{#snippet actions({ id, orgId }: { id: string; orgId: string })}
	<DataTableActions {orgId} {id} {onRemoveMember} />
{/snippet}

{#snippet localizedDate({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}

<div class={cn(`space-y-4`, className)} {...rest}>
	<div class={cn(`flex items-center justify-between gap-4`)}>
		<SearchInput class="max-w-sm" placeholder={$_('common.search')} type="text" />
		<div class="flex items-center gap-4">
			<CreateOrgInviteDialog {organizationId} />
		</div>
	</div>
	<QueryDataTable {columns} totalCount={$memberResponse.length} data={$data} {onChangeUserRole} />
</div>
