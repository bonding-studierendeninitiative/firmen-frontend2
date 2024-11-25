<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import type {
		ConfirmEventRegistrationSchema,
		EventRegistration,
		RejectEventRegistrationSchema
	} from '@schema';
	import { type Infer, type SuperValidated } from 'sveltekit-superforms';
	import { ConfirmEventRegistration, RejectEventRegistration } from '@/@svelte/modules';
	import { Badge } from '@/components/ui/badge';
	import type { InferOutput } from 'valibot';

	export let id: string;
	export let eventRegistration: InferOutput<EventRegistration>;
	export let confirmForm: SuperValidated<Infer<ConfirmEventRegistrationSchema>>;
	export let rejectForm: SuperValidated<Infer<RejectEventRegistrationSchema>>;
	let isConfirmOpen = false;
	let isRejectOpen = false;
</script>

<ConfirmEventRegistration {eventRegistration} {id} {confirmForm} bind:isOpen={isConfirmOpen} />
<RejectEventRegistration {id} {rejectForm} bind:isOpen={isRejectOpen} />

<DropdownMenu.Root>
	<DropdownMenu.Trigger asChild let:builder>
		<Button variant="ghost" builders={[builder]} size="icon" class="relative h-8 w-8 p-0">
			<span class="sr-only">Open menu</span>
			<Ellipsis class="h-4 w-4" />
		</Button>
	</DropdownMenu.Trigger>
	<DropdownMenu.Content>
		<DropdownMenu.Group>
			<DropdownMenu.Label>Actions</DropdownMenu.Label>
			<DropdownMenu.Item on:click={() => navigator.clipboard.writeText(id)}>
				Copy registration ID
			</DropdownMenu.Item>
		</DropdownMenu.Group>
		<DropdownMenu.Separator />
		<DropdownMenu.Item on:click={() => (isConfirmOpen = true)}>Confirm...</DropdownMenu.Item>
		<DropdownMenu.Item class="flex justify-between" disabled on:click={() => (isRejectOpen = true)}>
			Reject...
			<Badge>todo</Badge>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
