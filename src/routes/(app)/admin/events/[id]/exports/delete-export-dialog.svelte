<script lang="ts">
	import { page } from '$app/state';
	import { buttonVariants } from '@/components/ui/button';
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { trpc } from '@/trpc/client';
	import { Trash2 } from '@lucide/svelte';
	import { _ } from '@services';
	import { toast } from 'svelte-sonner';

	interface Props {
		exportId: string;
		eventId: string;
	}

	let { exportId, eventId }: Props = $props();

	let open = $state(false);

    const api = trpc(page)

    const utils = api.createUtils()

	const deleteMut = api.admin.export.delete.createMutation();

	function handleDelete(eventId: string, exportId: string) {
		$deleteMut.mutate(
			{
				eventId,
				exportId
			},
			{
				onSuccess: async (result) => {
					open = false;
					toast.success($_('admin-pages.events.exports.delete.success'));
                    await utils.admin.export.getAll.invalidate({eventId})
				},
				onError: (e) => {
					toast.error(e.message);
				}
			}
		);
	}
</script>

<AlertDialog.Root bind:open>
	<AlertDialog.Trigger class={buttonVariants({ variant: 'outline', size: 'sm' })}>
		<Trash2 class="h-4 w-4" />
	</AlertDialog.Trigger>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$_('admin-pages.events.exports.delete.title')}</AlertDialog.Title>
			<AlertDialog.Description>
				{$_('admin-pages.events.exports.delete.description')}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{$_('common.cancel')}</AlertDialog.Cancel>
			<AlertDialog.Action class={buttonVariants({variant: "destructive"})} onclick={() => handleDelete(eventId, exportId)}>
				{$_('common.delete')}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
