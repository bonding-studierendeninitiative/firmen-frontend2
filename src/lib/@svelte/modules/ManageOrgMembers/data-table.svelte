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
					value: row.role
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
			cell: () => ({
				snippet: actions,
				props: {}
			})
		}
	];
</script>

{#snippet userIcon({ src, userName }: { src: string; userName: string })}
	<DataTableUserIcon {src} {userName} />
{/snippet}

{#snippet userRole({ value }: { value: string })}
	{#if value == 'org:owner'}
		{$_('modules.manage-org-members.owner')}
	{:else if value == 'org:member'}
		{$_('modules.manage-org-members.member')}
	{:else if value == 'org:admin'}
		{$_('modules.manage-org-members.admin')}
	{:else}
		{value}
	{/if}
{/snippet}

{#snippet actions()}
	<DataTableActions />
{/snippet}

{#snippet localizedDate({ date }: { date: any })}
	<LocalizedDate {date} />
{/snippet}

<div class={cn(`space-y-4`, $$props.class)} {...$$restProps}>
	<div class={cn(`flex items-center justify-between gap-4`)}>
		<SearchInput class="max-w-sm" placeholder={$_('common.search')} type="text" />
		<CreateOrgInviteDialog {organizationId} />
	</div>
	<QueryDataTable {columns} {totalCount} data={$data} />
</div>
