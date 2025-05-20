<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { Trash2 } from 'lucide-svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { toast } from 'svelte-french-toast';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';

	export let id: string;
	export let orgId: string;

	const api = trpc($page);
	const utils = api.createUtils()
	const removeMember = api.admin.orgs.members.remove.createMutation();

	export let open = false;
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_("modules.remove-member-dialog.title")}</Dialog.Title>
			<Dialog.Description>{$_("modules.delete-logo-dialog.description")}</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer class="pt-6">
			<Dialog.Close class={buttonVariants({variant: "outline"})}>{$_("common.cancel")}</Dialog.Close>
			<Button on:click={() => {
					$removeMember.mutate({userId: id, organizationId: orgId}, {
						onError: (error) => {
							toast.error(error.message);
						},
						onSuccess: () => {
							toast.success('Member removed');
							utils.admin.orgs.members.getAll.invalidate()
							open = false;
						}
					})
				}} variant="destructive">
				<Trash2 class="mr-2 w-5 h-5" />
				{$_("common.delete")}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>