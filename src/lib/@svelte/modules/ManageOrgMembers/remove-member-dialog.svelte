<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { LoaderCircle, Trash2 } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { Switch } from '@/components/ui/switch';
	import { Label } from '@/components/ui/label';

	const api = trpc(page);
	const utils = api.createUtils();
	const removeMember = api.admin.orgs.members.remove.createMutation();

	interface Props {
		id: string;
		orgId: string;
		open?: boolean;
	}

	let { id, orgId, open = $bindable(false) }: Props = $props();

	let sendNotification = $state(false);
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('modules.remove-member-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.remove-member-dialog.description')}</Dialog.Description>
		</Dialog.Header>
		<div class="flex gap-3 items-center mt-6">
			<Switch id="sendNotification" bind:checked={sendNotification} />
			<Label for="sendNotification">Nutzer:in benachrichtigen</Label>
		</div>
		<Dialog.Footer class="pt-6">
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}
				>{$_('common.cancel')}</Dialog.Close
			>
			{#if $removeMember.isPending}
				<Button disabled variant="destructive">
					<Trash2 class="mr-2 size-5" />

					<LoaderCircle class="size-3 animate-spin mx-6" />
				</Button>
			{:else}
				<Button
					onclick={() => {
						$removeMember.mutate(
							{ userId: id, organizationId: orgId, sendNotification },
							{
								onError: (error) => {
									toast.error(error.message);
								},
								onSuccess: () => {
									toast.success('Member removed');
									utils.admin.orgs.members.getAll.invalidate();
									open = false;
								}
							}
						);
					}}
					variant="destructive"
				>
					<Trash2 class="mr-2 size-5" />
					{$_('common.delete')}
				</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
