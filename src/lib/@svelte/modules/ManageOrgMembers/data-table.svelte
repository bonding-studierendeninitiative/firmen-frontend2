<script lang="ts">
	import { derived, type Readable } from 'svelte/store';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableUserIcon from './data-table-user-icon.svelte';
	import { _ } from '@services';
	import { cn } from '@/utils/ui';
	import type { OrganizationMembership } from 'svelte-clerk/server';
	import { LocalizedDate, SearchInput, QueryDataTable } from '@/@svelte/components';
	import CreateOrgInviteDialog from './create-org-invite-dialog.svelte';
	import AddMemberDialog from './add-member-dialog.svelte';
	import DataTableRoleSwitcher from './data-table-role-switcher.svelte';
	import { createColumnHelper } from '@tanstack/svelte-table';
	import { renderSnippet } from '@/@svelte/components/QueryDataTable/render-helpers';

	interface Props {
		memberResponse: Readable<{ data: OrganizationMembership[]; totalCount: number }>;
		organizationId: string;
		class?: string;
		[key: string]: any;
	}

	let { memberResponse, organizationId, class: className = '', ...rest }: Props = $props();

	let data = derived([memberResponse], ([memberResponse]) => memberResponse.data);
	let totalCount = derived([memberResponse], ([memberResponse]) => memberResponse.totalCount);

	let columnHelper = createColumnHelper<OrganizationMembership>();

	let columns = [
		columnHelper.accessor('publicUserData', {
			id: 'user-profile',
			header: '',
			cell: ({ getValue }) =>
				renderSnippet(userIcon, {
					userName: `${getValue()?.firstName} ${getValue()?.lastName}`,
					src: getValue()?.imageUrl
				})
		}),
		columnHelper.accessor('publicUserData.firstName', {
			header: $_('table-headings.firstName')
		}),
		columnHelper.accessor('publicUserData.lastName', {
			header: $_('table-headings.lastName')
		}),
		columnHelper.accessor('publicUserData.identifier', {
			header: $_('table-headings.emailAddress')
		}),
		columnHelper.accessor('role', {
			header: $_('table-headings.role'),
			cell: ({ row, getValue }) =>
				renderSnippet(userRole, {
					value: getValue(),
					userId: row.original.publicUserData?.userId
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
		columnHelper.accessor('publicUserData.userId', {
			header: '',
			cell: ({ getValue }) =>
				renderSnippet(actions, {
					id: getValue(),
					orgId: organizationId
				})
		})
	];
</script>

{#snippet userIcon({ src, userName }: { src: string; userName: string })}
	<DataTableUserIcon {src} {userName} />
{/snippet}

{#snippet userRole({ value, userId }: { value: string; userId: string; orgId: string })}
	<DataTableRoleSwitcher {value} {organizationId} {userId} />
{/snippet}

{#snippet actions({ id, orgId }: { id: string; orgId: string })}
	<DataTableActions {orgId} {id} />
{/snippet}

{#snippet localizedDate({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}

<div class={cn(`space-y-4`, className)} {...rest}>
	<div class={cn(`flex items-center justify-between gap-4`)}>
		<SearchInput class="max-w-sm" placeholder={$_('common.search')} type="text" />
		<div class="flex items-center gap-4">
			<CreateOrgInviteDialog {organizationId} />
			<AddMemberDialog orgId={organizationId} />
		</div>
	</div>
	<QueryDataTable {columns} {totalCount} data={$data} />
</div>
