<script lang="ts">
	import DataTableActions from './data-table-actions.svelte';
	import DataTableUserIcon from './data-table-user-icon.svelte';
	import { _ } from '@services';
	import { cn } from '@/utils/ui';
	import { LocalizedDate, SearchInput, QueryDataTable } from '@/@svelte/components';
	import AddMemberDialog from './add-member-dialog.svelte';
	import DataTableRoleSwitcher from './data-table-role-switcher.svelte';
	import { createColumnHelper } from '@tanstack/table-core';
	import { renderSnippet } from '@/@svelte/components/QueryDataTable/render-helpers';
	import { ShieldBan } from '@lucide/svelte';

	type Data = {
		user: {
			id: string;
			email: string;
			name: string | null;
			image: string | null;
			banned: boolean | null;
		};
		role: string;
		createdAt: Date;
		id: string;
		userId: string;
		organizationId: string;
	};
	interface Props {
		memberResponse: Data[];
		organizationId: string;
		class?: string;
		showAddMemberButton?: boolean;
		onChangeUserRole?: (
			userId: string,
			role: 'admin' | 'member' | 'owner',
			organizationId: string
		) => void;
		onAddMember?: (userId: string, sendNotification: boolean) => void;
		onRemoveMember?: (memberId: string, sendNotification: boolean) => void;
		[key: string]: any;
	}

	let {
		memberResponse,
		organizationId,
		class: className = '',
		onChangeUserRole,
		onAddMember,
		onRemoveMember,
		showAddMemberButton = false,
		...rest
	}: Props = $props();

	let totalCount = $derived(memberResponse.length);

	let columnHelper = createColumnHelper<Data>();

	let columns = [
		columnHelper.display({
			id: 'user-profile',
			header: '',
			cell: ({ row }) =>
				renderSnippet(userIcon, {
					userName: `${row.original.user.name}`,
					src: row.original.user.image
				})
		}),
		columnHelper.accessor('user.name', {
			header: $_('table-headings.name'),
			cell: ({ getValue }) => getValue()
		}),
		columnHelper.accessor('user.email', {
			header: $_('table-headings.emailAddress'),
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
		columnHelper.accessor('user.banned', {
			id: 'banned',
			header: '',
			cell: ({ getValue }) => (getValue() ? renderSnippet(banned, {}) : null),
			enableSorting: false
		}),
		columnHelper.display({
			id: 'actions',
			header: '',
			cell: (props) =>
				renderSnippet(actions, {
					id: props.row.original.id,
					userId: props.row.original.userId,
					orgId: props.row.original.organizationId
				})
		})
	];
</script>

{#snippet userIcon({ src, userName }: { src: string | null | undefined; userName: string })}
	<DataTableUserIcon {src} {userName} />
{/snippet}

{#snippet userRole({ value, userId, orgId }: { value: string; userId: string; orgId: string })}
	<DataTableRoleSwitcher
		{value}
		{userId}
		onChangeUserRole={(userId, role) => onChangeUserRole?.(userId, role, orgId)}
	/>
{/snippet}

{#snippet actions({ id, orgId, userId }: { id: string; orgId: string; userId: string })}
	<DataTableActions {orgId} {id} {userId} {onRemoveMember} />
{/snippet}

{#snippet banned()}
	<ShieldBan />
{/snippet}

{#snippet localizedDate({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}

<div class={cn(`space-y-4`, className)} {...rest}>
	<div class={cn(`flex items-center justify-between gap-4`)}>
		<SearchInput class="max-w-sm" placeholder={$_('common.search')} type="text" />
		<div class="flex items-center gap-4">
			{#if showAddMemberButton}
				<AddMemberDialog orgId={organizationId} {onAddMember} />
			{/if}
		</div>
	</div>
	<QueryDataTable {columns} {totalCount} data={memberResponse} />
</div>
