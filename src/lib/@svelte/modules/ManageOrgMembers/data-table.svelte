<script lang="ts">
	import { derived, type Readable } from 'svelte/store';
	import DataTableActions from './data-table-actions.svelte';
	import DataTableUserIcon from './data-table-user-icon.svelte';
	import { _ } from '@services';
	import { cn } from '@/utils/tailwind';
	import type { OrganizationMembership } from 'svelte-clerk/server';

	export let memberResponse: Readable<{ data: OrganizationMembership[]; totalCount: number }>;
	export let organizationId: string;
	import { LocalizedDate, SearchInput, QueryDataTable } from '@/@svelte/components';
	import CreateOrgInviteDialog from './create-org-invite-dialog.svelte';
	import AddMemberDialog from './add-member-dialog.svelte';
	import DataTableRoleSwitcher from './data-table-role-switcher.svelte';

	let data = derived([memberResponse], ([memberResponse]) => memberResponse.data);
	let totalCount = derived([memberResponse], ([memberResponse]) => memberResponse.totalCount);

	let columns = [
		{
			id: 'user-profile',
			header: '',
			cell: (row) => ({
				snippet: userIcon,
				props: {
					userName: `${row.publicUserData?.firstName} ${row.publicUserData?.lastName}`,
					src: row.publicUserData?.imageUrl
				}
			})
		},
		{
			accessor: ({ publicUserData }) => publicUserData?.firstName ?? '',
			id: 'first_name',
			header: $_('table-headings.firstName')
		},

		{
			accessor: ({ publicUserData }) => publicUserData?.lastName ?? '',
			id: 'last_name',
			header: $_('table-headings.lastName')
		},

		{
			accessor: ({ publicUserData }) => publicUserData?.identifier,
			id: 'email_address',
			header: $_('table-headings.emailAddress')
		},
		{
			id: 'role',
			header: $_('table-headings.role'),
			cell: (row) => ({
				snippet: userRole,
				props: {
					value: row.role,
					userId: row.publicUserData.userId
				}
			})
		},
		{
			id: 'createdAt',
			header: $_('table-headings.joined'),
			cell: (row) => ({
				snippet: localizedDate,
				props: {
					date: row.createdAt
				}
			})
		},
		{
			header: '',
			cell: ({ publicUserData }) => ({
				snippet: actions,
				props: {
					id: publicUserData.userId,
					orgId: organizationId
				}
			})
		}
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

<div class={cn(`space-y-4`, $$props.class)} {...$$restProps}>
	<div class={cn(`flex items-center justify-between gap-4`)}>
		<SearchInput class="max-w-sm" placeholder={$_('common.search')} type="text" />
		<div class="flex items-center gap-4">
			<CreateOrgInviteDialog {organizationId} />
			<AddMemberDialog orgId={organizationId} />
		</div>
	</div>
	<QueryDataTable {columns} {totalCount} data={$data} />
</div>
