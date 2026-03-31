<script lang="ts">
	import { buttonVariants } from '@/components/ui/button';
	import * as AlertDialog from '@/components/ui/alert-dialog';
	import { Trash2 } from '@lucide/svelte';
	import { _ } from '@services';

	interface Props {
		exportId: string;
		eventId: string;
		onDelete: ({ eventId, exportId }: { eventId: string; exportId: string }) => void;
	}

	let { exportId, eventId, onDelete }: Props = $props();

	let open = $state(false);
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
			<AlertDialog.Action
				class={buttonVariants({ variant: 'destructive' })}
				onclick={() => {
					onDelete({ eventId, exportId });
					open = false;
				}}
			>
				{$_('common.delete')}
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
