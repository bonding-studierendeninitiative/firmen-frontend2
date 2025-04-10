<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import DeleteEventRegistrationForm from './delete-event-registration-form.svelte';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Button } from '@/components/ui/button';
	import type {
		AdminEventRegistrationsResponse
	} from '@schema';
	import { ConfirmEventRegistration, RejectEventRegistration } from '@/@svelte/modules';
	import type { InferOutput } from 'valibot';
	import { _ } from '@services';

	export let id: string;
	export let eventRegistration: InferOutput<AdminEventRegistrationsResponse>['eventRegistrations'][number];
	let isConfirmOpen = false;
	let isRejectOpen = false;
	let isDeleteOpen = false;
</script>

<ConfirmEventRegistration {eventRegistration} {id} bind:isOpen={isConfirmOpen} />
<RejectEventRegistration {id} bind:isOpen={isRejectOpen} />
<DeleteEventRegistrationForm eventRegistrationId={id} bind:open={isDeleteOpen} />

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">{$_("common.open-menu")}</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>{$_("admin-pages.events.event-registrations.data-table.actions.actions")}</DropdownMenu.Label>
			<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				{$_("admin-pages.events.event-registrations.data-table.actions.copy-id")}
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (isConfirmOpen = true)}>
			{$_("admin-pages.events.event-registrations.data-table.actions.confirm")}
		</DropdownMenu.Item>
		<DropdownMenu.Item on:click={() => (isRejectOpen = true)}>
			{$_("admin-pages.events.event-registrations.data-table.actions.reject")}
		</DropdownMenu.Item>
		<DropdownMenu.Item class="text-red-500" on:click={() => (isDeleteOpen = true)}>
			{$_("admin-pages.events.event-registrations.data-table.actions.delete-event-registration")}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
