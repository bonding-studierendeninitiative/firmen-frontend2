<script lang="ts">
	import { ManageOrgMembers } from '@/@svelte/modules';
	import { fade } from 'svelte/transition';
	import authClient from '@/auth-client';
	import { _ } from '@services/i18n';
	import * as Card from '@/components/ui/card';
	import * as Field from '@/components/ui/field';
	import { Button } from '@/components/ui/button';
	import { DeleteOrganizationCard, LeaveOrganizationCard } from '@/components/organization';

	let { data } = $props();

	import { getAll as getAllOrgMembers } from '@/remote/functions/orgMembers.remote.js';
	import EditOrganizationDetailsForm from './edit-organization-details-form.svelte';

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
	<section class="grid gap-x-8 grid-cols-3 @container gap-y-8">
		<div class="@3xl:col-span-1 col-span-3">
			<h2 class=" text-stone-800 text-lg font-extrabold">
				{$_('user-pages.settings.danger-zone.title')}
			</h2>
			<h4 class=" text-stone-500 text-sm text-balance">
				{$_('user-pages.settings.danger-zone.description')}
			</h4>
		</div>
		<div class="space-y-6 @3xl:col-span-2 col-span-3">
			<Card.Root>
				<Card.Content class="pt-6 space-y-3">
					<Field.Group>
						<Field.Field>
							<LeaveOrganizationCard
								className="w-full"
								classNames={{
									base: 'bg-destructive/5 border-destructive/20'
								}}
								activeOrganization={data.organization}
								hasPermission={data.hasPermission?.success}
							/>
						</Field.Field>
						<Field.Field>
							<DeleteOrganizationCard
								className="w-full"
								classNames={{
									base: 'bg-destructive/5 border-destructive/20'
								}}
								activeOrganization={data.organization}
								hasPermission={data.hasPermission?.success}
							/>
						</Field.Field>
					</Field.Group>
				</Card.Content>
			</Card.Root>
		</div>
	</section>
</div>
