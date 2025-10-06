<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';

	interface Props {
		open?: boolean;
		eventRegistrationId: string;
		onDelete: ({ eventRegistrationId }: { eventRegistrationId: string }) => Promise<void>;
	}

	let { open = $bindable(false), eventRegistrationId, onDelete }: Props = $props();
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Title>$_('admin-pages.events.event-registrations.delete-dialog.title')</Dialog.Title>
		<p>$_('admin-pages.events.event-registrations.delete-dialog.description')</p>
		<Dialog.Footer>
			<Button
				onclick={async () => {
					try {
						await onDelete({ eventRegistrationId });
						open = false;
					} catch (error) {
						console.error('Error deleting event registration:', error);
					}
				}}
				variant="destructive">{$_('common.delete')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
