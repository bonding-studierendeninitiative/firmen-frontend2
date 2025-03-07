<script lang="ts">
	import { _ } from '@services';
	import * as Dialog from '$lib/components/ui/dialog';
	import LoaderCircle from 'lucide-svelte/icons/loader-circle';
	import { Button } from '@/components/ui/button';
	import { Control, Description, Field, FieldErrors, Label } from '@/components/ui/form';
	import { Input } from '@/@svelte/components';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { type CreateOrgInviteRequest, CreateOrgInviteRequestSchema } from '@schema';
	import { valibot } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-french-toast';
	import DataTable from './data-table.svelte';
	import type { InferOutput } from 'valibot';
	import type { OrganizationMembership } from 'svelte-clerk/server';

	let inviteMemberDialogOpen = false;

	export let createInviteForm: SuperValidated<InferOutput<CreateOrgInviteRequest>> | undefined;
	export let organizationMembers: { data: OrganizationMembership[]; totalCount: number };

	let superform = superForm(createInviteForm, {
		validators: valibot(CreateOrgInviteRequestSchema),
		applyAction: true,
		dataType: 'json',
		invalidateAll: 'force',
		onResult({ result }) {
			if (result.type === 'success') {
				inviteMemberDialogOpen = false;
				toast.success($_('modules.manage-org-members.invitationSuccess'));
			} else if (result.type === 'error') {
				toast.error(result.error.message);
			}
		}
	});
	let { form: formData, enhance, submitting } = superform;
</script>

<div {...$$restProps} >
<DataTable memberResponse={organizationMembers} bind:inviteMemberDialogOpen />
</div>

<Dialog.Root bind:open={inviteMemberDialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.manage-org-members.invite-dialog-title')}</Dialog.Title>
			<Dialog.Description>
				{$_('modules.manage-org-members.invite-dialog-description')}
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createInvite" method="POST" id="create-invite-form" use:enhance>
			<div class=" flex flex-col gap-1">
				<Field form={superform} name="userMail">
					<Control let:attrs>
						<Label>{$_("admin-pages.organizations.organizationEmail")}</Label>
						<Input
							{...attrs}
							bind:value={$formData.userMail}
							placeholder={$_(
									'user-pages.organizations.createOrganization.placeholders.organizationEmail'
								)}
						/>
					</Control>

					<Description />
					<FieldErrors />
				</Field>

				<footer>
					<footer class=" flex justify-end items-center w-full">
						<Button
							class="mr-2"
							variant="outline"
							on:click={() => (inviteMemberDialogOpen = false)}>{$_('common.cancel')}</Button
						>
						{#if $submitting}
							<Button form="create-invite-form" disabled>
								<LoaderCircle class="mr-2 h-4 w-4 animate-spin" />{$_(
								'modules.manage-org-members.invite'
							)}
							</Button>
						{:else}
							<Button form="create-invite-form" type="submit"
							>{$_('modules.manage-org-members.invite')}</Button
							>
						{/if}
					</footer>
				</footer>
			</div>
		</form>
	</Dialog.Content>
</Dialog.Root>