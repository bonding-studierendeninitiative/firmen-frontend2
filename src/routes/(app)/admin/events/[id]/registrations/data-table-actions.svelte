<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import DeleteEventRegistrationForm from './delete-event-registration-form.svelte';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Button } from '@/components/ui/button';
	import { ConfirmEventRegistration, RejectEventRegistration } from '@/@svelte/modules';
	import { _ } from '@services';
	import type { GetEventRegistrationsOutput } from '@/remote/functions/admin';

	interface Props {
		id: string | null | undefined;
		eventRegistration: GetEventRegistrationsOutput['eventRegistrations'][number];
		onDelete: ({ eventRegistrationId }: { eventRegistrationId: string }) => Promise<void>;
		onReject: ({ eventRegistrationId }: { eventRegistrationId: string }) => Promise<void>;
		onConfirm: ({ eventRegistrationId }: { eventRegistrationId: string }) => Promise<void>;
	}

	let { id, eventRegistration, onDelete, onReject, onConfirm }: Props = $props();
	let isConfirmOpen = $state(false);
	let isRejectOpen = $state(false);
	let isDeleteOpen = $state(false);
</script>

{#if id}
	<ConfirmEventRegistration {eventRegistration} bind:isOpen={isConfirmOpen} {onConfirm} />
	<RejectEventRegistration {id} bind:isOpen={isRejectOpen} {onReject} />
	<DeleteEventRegistrationForm eventRegistrationId={id} bind:open={isDeleteOpen} {onDelete} />

	<DropdownMenu.Root>
		<DropdownMenu.Trigger>
			{#snippet child({ props })}
				<Button variant="ghost" {...props} size="icon" class="relative size-8 p-0">
					<span class="sr-only">{$_('common.open-menu')}</span>
					<Ellipsis class="size-4" />
				</Button>
			{/snippet}
		</DropdownMenu.Trigger>
		<DropdownMenu.Content>
			<DropdownMenu.Group>
				<DropdownMenu.Label
					>{$_(
						'admin-pages.events.event-registrations.data-table.actions.actions'
					)}</DropdownMenu.Label
				>
				<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
					{$_('admin-pages.events.event-registrations.data-table.actions.copy-id')}
				</DropdownMenu.Item>
			</DropdownMenu.Group>
			<DropdownMenu.Separator />
			<DropdownMenu.Item onclick={() => (isConfirmOpen = true)}>
				{$_('admin-pages.events.event-registrations.data-table.actions.confirm')}
			</DropdownMenu.Item>
			<DropdownMenu.Item onclick={() => (isRejectOpen = true)}>
				{$_('admin-pages.events.event-registrations.data-table.actions.reject')}
			</DropdownMenu.Item>
			<DropdownMenu.Item class="text-red-500" onclick={() => (isDeleteOpen = true)}>
				{$_('admin-pages.events.event-registrations.data-table.actions.delete-event-registration')}
			</DropdownMenu.Item>
		</DropdownMenu.Content>
	</DropdownMenu.Root>
{/if}
