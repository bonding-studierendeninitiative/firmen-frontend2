<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { toast } from 'svelte-sonner';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/stores';
	import { _ } from '@services';

	export let open = false;

	export let eventRegistrationId: string;

	const api = trpc($page);
	const utils = api.createUtils();

	const deleteEventRegistration = api.admin.eventRegistrations.delete.createMutation();
</script>

<Dialog.Root bind:open>
	<Dialog.Content>
		<Dialog.Title>$_('admin-pages.events.event-registrations.delete-dialog.title')</Dialog.Title>
		<p>$_('admin-pages.events.event-registrations.delete-dialog.description')</p>
		<Dialog.Footer>
			<Button
				on:click={() => {
					$deleteEventRegistration.mutate(
						{
							eventRegistrationId
						},
						{
							onError: (error) => toast.error(error.message),
							onSuccess: async () => {
								open = false;
								toast.success($_('admin-pages.events.event-registrations.delete-dialog.success'));
								await utils.admin.events.getEventRegistrations.invalidate({
									eventId: $page.params.id
								});
							}
						}
					);
				}}
				variant="destructive">{$_('common.delete')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
