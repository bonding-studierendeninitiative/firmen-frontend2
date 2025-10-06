<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { EventRegistration } from '@/@svelte/modules';
	import { _ } from '@services';
	import type { GetEventRegistrationsOutput } from '@/trpc/routers/admin';

	interface Props {
		isOpen: boolean;
		eventRegistration: GetEventRegistrationsOutput['eventRegistrations'][number];
		onConfirm: ({ eventRegistrationId }: { eventRegistrationId: string }) => Promise<void>;
	}

	let { isOpen = $bindable(), eventRegistration, onConfirm }: Props = $props();
</script>

{#if !!eventRegistration.id}
	<Dialog.Root bind:open={isOpen}>
		<Dialog.Content>
			<Dialog.Header class="space-y-4">
				<Dialog.Title
					>{$_(
						'admin-pages.events.event-registrations.confirm-event-registration.title'
					)}</Dialog.Title
				>
				<Dialog.Description
					>{$_(
						'admin-pages.events.event-registrations.confirm-event-registration.title'
					)}</Dialog.Description
				>
			</Dialog.Header>
			<EventRegistration class="py-4" {eventRegistration} />

			<Dialog.Footer>
				<Button
					onclick={async () => {
						try {
							await onConfirm({ eventRegistrationId: eventRegistration.id });
							isOpen = false;
						} catch (error) {
							console.error('Error confirming event registration:', error);
						}
					}}
					>{$_('admin-pages.events.event-registrations.confirm-event-registration.proceed')}</Button
				>
			</Dialog.Footer>
		</Dialog.Content>
	</Dialog.Root>
{/if}
