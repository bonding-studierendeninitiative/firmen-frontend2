<script lang="ts">
	import Ellipsis from '@lucide/svelte/icons/ellipsis';
	import DeleteEventRegistrationForm from './delete-event-registration-form.svelte';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Button } from '@/components/ui/button';
	import type {
		AdminEventRegistrationsResponse
	} from '@schema';
	import { ConfirmEventRegistration, RejectEventRegistration } from '@/@svelte/modules';
	import type { InferOutput } from 'valibot';
	import { _ } from '@services';

	interface Props {
		id: string;
		eventRegistration: InferOutput<AdminEventRegistrationsResponse>['eventRegistrations'][number];
	}

	let { id, eventRegistration }: Props = $props();
	let isConfirmOpen = $state(false);
	let isRejectOpen = $state(false);
	let isDeleteOpen = $state(false);
</script>

<ConfirmEventRegistration {eventRegistration} bind:isOpen={isConfirmOpen} />
<RejectEventRegistration {id} bind:isOpen={isRejectOpen} />
<DeleteEventRegistrationForm eventRegistrationId={id} bind:open={isDeleteOpen} />

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
				<Button variant="ghost" {...props} size="icon" class="relative size-8 p-0">
				<span class="sr-only">{$_("common.open-menu")}</span>
				<Ellipsis class="size-4" />
			</Button>
					{/snippet}
		</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>{$_("admin-pages.events.event-registrations.data-table.actions.actions")}</DropdownMenu.Label>
			<DropdownMenu.Item onclick={() => navigator.clipboard.writeText(id)}>
				{$_("admin-pages.events.event-registrations.data-table.actions.copy-id")}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item onclick={() => (isConfirmOpen = true)}>
			{$_("admin-pages.events.event-registrations.data-table.actions.confirm")}
		</DropdownMenu.Item>
		<DropdownMenu.Item onclick={() => (isRejectOpen = true)}>
			{$_("admin-pages.events.event-registrations.data-table.actions.reject")}
		</DropdownMenu.Item>
		<DropdownMenu.Item class="text-red-500" onclick={() => (isDeleteOpen = true)}>
			{$_("admin-pages.events.event-registrations.data-table.actions.delete-event-registration")}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
