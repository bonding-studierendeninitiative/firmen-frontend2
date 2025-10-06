<script lang="ts">
	import { EditOrganizationDetailsForm, ManageOrgMembers } from '@/@svelte/modules';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { trpc } from '@/trpc/client';
	import { derived } from 'svelte/store';
	import { page } from '$app/state';
	import authClient from '@/auth-client';
	import { _ } from '@services/i18n';
	import * as Card from '@/components/ui/card';
	import { DeleteOrganizationCard, LeaveOrganizationCard } from '@/components/organization';

	let { data } = $props();

	let api = trpc(page);

	let utils = api.createUtils();

	let membersQuery = api.orgMembers.getAll.createQuery(
		{
			offset: '0',
			limit: '10',
			sortBy: 'createdAt',
			sortDirection: 'desc'
		},
		{
			initialData: data.orgMembers,
			staleTime: 0
		}
	);

	let memberResponse = derived(membersQuery, ($membersQuery) => {
		if ($membersQuery.isLoading) return [];
		if ($membersQuery.isError) return [];
		return $membersQuery.data?.members || [];
	});
</script>

<div in:fade class="space-y-8">
	<section class="space-y-6">
		<div class="flex flex-col">
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.settings.org-members.title')}
			</h2>
			<h4 class=" text-stone-500 text-sm text-balance">
				{$_('user-pages.settings.org-members.description')}
			</h4>
		</div>
		<ManageOrgMembers
			organizationId={data.organization?.id || ''}
			{memberResponse}
			onChangeUserRole={async (userId, role, organizationId) => {
				await authClient.organization.updateMemberRole(
					{ memberId: userId, role, organizationId },
					{
						onSuccess: () => {
							utils.orgMembers.getAll.invalidate({
								offset: '0',
								limit: '10',
								sortBy: 'createdAt',
								sortDirection: 'desc'
							});
						},
						onError: (error) => {
							console.error('Failed to update user role:', error);
						}
					}
				);
			}}
		/>
	</section>
	{#await data.editOrganizationDetailsForm}
		<LoaderCircle class="size-10 mx-auto animate-spin" />
	{:then editOrganizationDetailsForm}
		<EditOrganizationDetailsForm {editOrganizationDetailsForm} />
	{:catch error}
		<p>{error}</p>
	{/await}
	<LeaveOrganizationCard
		className="w-full"
		classNames={{}}
		activeOrganization={data.organization}
		hasPermission={data.hasPermission?.success}
	/>
	<DeleteOrganizationCard
		className="w-full"
		classNames={{}}
		activeOrganization={data.organization}
		hasPermission={data.hasPermission?.success}
	/>
</div>
