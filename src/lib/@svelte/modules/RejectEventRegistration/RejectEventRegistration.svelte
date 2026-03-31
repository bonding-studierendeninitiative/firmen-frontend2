<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { _ } from '@services';

	interface Props {
		isOpen: boolean;
		id: string;
		onReject: ({ eventRegistrationId }: { eventRegistrationId: string }) => Promise<void>;
	}

	let { isOpen = $bindable(), id, onReject }: Props = $props();
</script>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title
				>{$_(
					'admin-pages.events.event-registrations.reject-event-registration.title'
				)}</Dialog.Title
			>
			<Dialog.Description
				>{$_(
					'admin-pages.events.event-registrations.reject-event-registration.description'
				)}</Dialog.Description
			>
		</Dialog.Header>
		<Dialog.Footer>
			<Button
				onclick={async () => {
					try {
						await onReject({ eventRegistrationId: id });
						isOpen = false;
					} catch (error) {
						console.error('Error rejecting event registration:', error);
					}
				}}
				variant="destructive"
				>{$_('admin-pages.events.event-registrations.reject-event-registration.proceed')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
