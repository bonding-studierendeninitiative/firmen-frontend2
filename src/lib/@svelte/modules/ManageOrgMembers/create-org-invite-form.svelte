<script lang="ts">
	import { _ } from '@services';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { createInvite } from '@/remote/functions';
	import { Label } from '@/components/ui/label';
	import { LoaderCircle } from '@lucide/svelte';

	interface Props {
		inviteMemberDialogOpen?: boolean;
		onSuccess?: () => Promise<void>;
	}

	let { inviteMemberDialogOpen = $bindable(false), onSuccess }: Props = $props();
</script>

<form
	{...createInvite.enhance(async () => {
		try {
			await onSuccess?.();
			inviteMemberDialogOpen = false;
		} catch (error) {
			console.error('Failed to send invite:', error);
		}
	})}
>
	<div class=" flex flex-col gap-1">
		<Label>{$_('admin-pages.organizations.organizationEmail')}</Label>
		<Input
			name={createInvite.field('email')}
			placeholder={$_('user-pages.organizations.createOrganization.placeholders.organizationEmail')}
		/>

		<footer class=" flex justify-end items-center w-full">
			<Button class="mr-2" variant="outline" onclick={() => (inviteMemberDialogOpen = false)}
				>{$_('common.cancel')}</Button
			>
			{#if createInvite.pending > 0}
				<Button disabled>
					<LoaderCircle class="mr-2 size-4 animate-spin" />{$_('modules.manage-org-members.invite')}
				</Button>
			{:else}
				<Button type="submit">{$_('modules.manage-org-members.invite')}</Button>
			{/if}
		</footer>
	</div>
</form>
