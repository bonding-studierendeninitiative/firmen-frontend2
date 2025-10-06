<script lang="ts">
	import { _ } from '@services';
	import * as Dialog from '$lib/components/ui/dialog';
	import CreateOrgInviteForm from './create-org-invite-form.svelte';
	import { cn } from '@/utils';
	import { buttonVariants } from '@/components/ui/button';
	import { createInviteForm } from '@/trpc/routers/admin';

	let inviteMemberDialogOpen = $state(false);
	interface Props {
		organizationId: string;
	}

	let { organizationId }: Props = $props();
</script>

<Dialog.Root bind:open={inviteMemberDialogOpen}>
	<Dialog.Trigger class={cn(buttonVariants({ variant: 'outline' }))}>
		{$_('modules.manage-org-members.invite')}
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.manage-org-members.invite-dialog-title')}</Dialog.Title>
			<Dialog.Description>
				{$_('modules.manage-org-members.invite-dialog-description')}
			</Dialog.Description>
		</Dialog.Header>
		{#if createInviteForm({ organizationId }).ready}
			<CreateOrgInviteForm
				bind:inviteMemberDialogOpen
				createInviteForm={createInviteForm({
					organizationId
				}).current!}
			/>
		{/if}
	</Dialog.Content>
</Dialog.Root>
