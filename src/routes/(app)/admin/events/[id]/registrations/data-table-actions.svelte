<script lang="ts">
	import Ellipsis from 'lucide-svelte/icons/ellipsis';
	import ReviewRegistrationForm from './review-registration-form.svelte';
	import DeleteEventRegistrationForm from './delete-event-registration-form.svelte';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Button } from '@/components/ui/button';
	import type {
		EventRegistration, AdminEventRegistrationsResponse
	} from '@schema';
	import { ConfirmEventRegistration, RejectEventRegistration, ReviewCatalogueData } from '@/@svelte/modules';
	import type { InferOutput } from 'valibot';
	import { _ } from '@services';
	import { getContext } from 'svelte';

	export let id: string;
	export let eventRegistration: InferOutput<AdminEventRegistrationsResponse>['eventRegistrations'][number];
	let rejectForm = getContext('rejectForm');
	let confirmForm = getContext('confirmForm');
	let deleteForm = getContext('deleteForm');
	let isConfirmOpen = false;
	let isRejectOpen = false;
	let isReviewCatalogueDataOpen = false;
	let isDeleteOpen = false;
</script>

{#await confirmForm}
	<div></div>
{:then form}
	<!--<ReviewRegistrationForm />-->
	<ConfirmEventRegistration confirmForm={form} {eventRegistration} {id} bind:isOpen={isConfirmOpen} />
{:catch error}
	<div>{error.message}</div>
{/await}
{#await rejectForm}
	<div></div>
{:then form}
	<RejectEventRegistration rejectForm={form} {id} bind:isOpen={isRejectOpen} />
{:catch error}
	<div>{error.message}</div>
{/await}
{#await deleteForm}
	<div></div>
{:then form}
	<DeleteEventRegistrationForm deleteForm={form} eventRegistrationId={id} bind:open={isDeleteOpen} />
{:catch error}
	<div>{error.message}</div>
{/await}
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
		<DropdownMenu.Item class="text-red-500" on:click={() => (isDeleteOpen = true)}>
			{$_("admin-pages.events.event-registrations.data-table.actions.delete-event-registration")}
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
