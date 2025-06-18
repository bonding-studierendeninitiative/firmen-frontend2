<script lang="ts">
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import type { AdminEventRegistrationsResponse } from '@schema';
	import { toast } from 'svelte-sonner';
	import type { InferOutput } from 'valibot';
	import { EventRegistration } from '@/@svelte/modules';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import { page } from '$app/state';

	interface Props {
		isOpen: boolean;
		eventRegistration: InferOutput<AdminEventRegistrationsResponse>['eventRegistrations'][number];
	}

	let { isOpen = $bindable(), eventRegistration }: Props = $props();

	const api = trpc(page);
	const utils = api.createUtils();

	const confirmEventRegistration = api.admin.eventRegistrations.confirm.createMutation();
</script>

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
				onclick={() => {
					$confirmEventRegistration.mutate(
						{
							eventRegistrationId: eventRegistration.id
						},
						{
							onSuccess: async () => {
								toast.success(
									$_('admin-pages.events.event-registrations.confirm-event-registration.success')
								);
								isOpen = false;
								await utils.admin.events.getEventRegistrations.invalidate();
							},
							onError: (err) => {
								toast.error(err.message);
							}
						}
					);
				}}>{$_('admin-pages.events.event-registrations.confirm-event-registration.proceed')}</Button
			>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
