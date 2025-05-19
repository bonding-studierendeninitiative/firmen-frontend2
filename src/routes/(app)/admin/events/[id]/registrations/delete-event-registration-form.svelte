<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import { Button } from '@/components/ui/button';
	import { toast } from 'svelte-french-toast';
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
		<Dialog.Title>Delete Event Registration</Dialog.Title>
		<p>Are you sure you want to delete this event registration?</p>
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
								toast.success('Event registration deleted');
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
