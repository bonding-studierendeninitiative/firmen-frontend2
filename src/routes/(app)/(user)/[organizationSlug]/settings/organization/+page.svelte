<script lang="ts">
	import { EditOrganizationDetailsForm, ManageOrgMembers } from '@/@svelte/modules';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import authClient from '@/auth-client';
	import { _ } from '@services/i18n';
	import { DeleteOrganizationCard, LeaveOrganizationCard } from '@/components/organization';

	let { data } = $props();

	import { getAll as getAllOrgMembers } from '@/remote/functions/orgMembers.remote.js';

	let membersResponse = getAllOrgMembers({
		offset: '0',
		limit: '10',
		sortBy: 'createdAt',
		sortDirection: 'desc'
	});

	let orgPublicMetadata = $derived(
		JSON.parse(data.organization?.metadata ?? '{ "public": {} }')?.public
	);
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
			{membersResponse}
			onChangeUserRole={async (userId, role, organizationId) => {
				await authClient.organization.updateMemberRole(
					{ memberId: userId, role, organizationId },
					{
						onSuccess: () => {
							membersResponse.refresh();
						},
						onError: (error) => {
							console.error('Failed to update user role:', error);
						}
					}
				);
			}}
		/>
	</section>
	<EditOrganizationDetailsForm
		orgDetails={orgPublicMetadata}
		orgAddress={orgPublicMetadata?.organizationAddress}
	/>
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
