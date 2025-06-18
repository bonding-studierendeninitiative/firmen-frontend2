<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { toast } from 'svelte-sonner';

	interface Props {
		isOpen: boolean;
		id: string;
	}

	let { isOpen = $bindable(), id }: Props = $props();

	const api = trpc(page);
	const utils = api.createUtils();

	const rejectEventRegistration = api.admin.eventRegistrations.reject.createMutation();
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
				onclick={() => {
					$rejectEventRegistration.mutate(
						{
							eventRegistrationId: id
						},
						{
							onSuccess: async () => {
								toast.success(
									$_('admin-pages.events.event-registrations.reject-event-registration.success')
								);
								isOpen = false;
								await utils.admin.events.getEventRegistrations.invalidate();
							},
							onError: (err) => {
								toast.error(err.message);
							}
						}
					);
				}}>{$_('admin-pages.events.event-registrations.reject-event-registration.proceed')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
