<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { Button } from '$lib/components/ui/button';
	import type {
		EventRegistration
	} from '@schema';
	import { ConfirmEventRegistration, RejectEventRegistration, ReviewCatalogueData } from '@/@svelte/modules';
	import type { InferOutput } from 'valibot';
	import { _ } from '@services';

	export let id: string;
	export let eventRegistration: InferOutput<EventRegistration>;
	let isConfirmOpen = false;
	let isRejectOpen = false;
	let isReviewCatalogueDataOpen = false;
</script>

<ConfirmEventRegistration {eventRegistration} {id} bind:isOpen={isConfirmOpen} />
<RejectEventRegistration {id} bind:isOpen={isRejectOpen} />
<ReviewCatalogueData {eventRegistration} {id} bind:isOpen={isReviewCatalogueDataOpen} />

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
		<DropdownMenu.Item on:click={() => (isReviewCatalogueDataOpen = true)}>
			{$_("admin-pages.events.event-registrations.data-table.actions.review-catalogue-data")}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
