<script lang="ts">
	import { _ } from '@services';
	import { NoDataFound } from '@/@svelte/components';
	import { ChevronLeft, ChevronRight } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import DataTable from './data-table.svelte';
	import {
		confirmEventRegistration,
		createEventRegistration,
		deleteEventRegistration,
		getEventRegistrations,
		rejectEventRegistration
	} from '@/remote/functions/admin';
	import { toast } from 'svelte-sonner';
	import * as Pagination from '@/components/ui/pagination';
	import CreateEventRegistrationForm from './create-event-registration-form.svelte';
	import type { AdminRegisterOrganizationToEventInput } from '@api/admin-client';

	let eventRegistrationFilters = $derived({
		limit: 10,
		eventId: page.params.id!,
		page: 0
	});

	const onCreateEventRegistration = async (input: AdminRegisterOrganizationToEventInput) => {
		try {
			await createEventRegistration(input).updates(
				eventRegistrationsQuery.withOverride((prev) => {
					const eventId = input.eventId;
					const organizationId = input.organizationId;
					const contactPeople = input.contactPeople;
					const canUploadAdvertisement = input.canUploadAdvertisement;
					const confirmedRegistration = input.confirmedRegistration;
					return {
						...prev,
						eventRegistrations: [
							...prev.eventRegistrations,
							{
								id: 'new-id',
								eventId,
								organization: {
									id: organizationId,
									name: 'Loading...',
									logo: null,
									address: ''
								},
								contactPeople,
								canUploadAdvertisement,
								confirmedRegistration
							}
						]
					};
				})
			);
			console.log('Created event registration');
			toast.success('Die Anmeldung wurde erfolgreich erstellt');
		} catch (error) {
			toast.error('Fehler beim Erstellen der Anmeldung');
			// Re-throw so the dialog component can keep the dialog open on failure
			throw error;
		}
	};

	let eventRegistrationDialogOpen = $state(false);
	let eventRegistrationsQuery = $derived(getEventRegistrations(eventRegistrationFilters));
</script>

<section in:fade class=" mt-6">
	<CreateEventRegistrationForm
		bind:open={eventRegistrationDialogOpen}
		{onCreateEventRegistration}
	/>

	{#if Number(eventRegistrationsQuery.current?.eventRegistrations.length) < 1}
		<section class=" mt-10">
			<NoDataFound
				heading={$_('admin-pages.events.noRegistrationsFound')}
				subHeading={$_('admin-pages.events.noDataToDisplay')}
				buttonText={$_('admin-pages.events.backToEvents')}
				onButtonClick={() => {}}
			/>
		</section>
	{:else}
		<section class=" mt-10 space-y-4">
			<DataTable
				isLoading={eventRegistrationsQuery.loading}
				data={eventRegistrationsQuery.current?.eventRegistrations ?? []}
				onDelete={async ({ eventRegistrationId }) => {
					try {
						await deleteEventRegistration({ eventRegistrationId }).updates(
							eventRegistrationsQuery.withOverride((prev) => {
								return {
									...prev,
									eventRegistrations: prev.eventRegistrations.filter(
										(reg) => reg.id !== eventRegistrationId
									),
									totalElements: Number(prev.totalElements) - 1
								};
							})
						);
						console.log('Delete event registration:', eventRegistrationId);
						toast.success('Die Anmeldung wurde erfolgreich gelöscht');
					} catch (error) {
						console.error('Error deleting event registration:', error);
						toast.error('Fehler beim Löschen der Anmeldung');
					}
				}}
				onReject={async ({ eventRegistrationId }) => {
					try {
						await rejectEventRegistration({ eventRegistrationId }).updates(
							eventRegistrationsQuery.withOverride((prev) => {
								return {
									...prev,
									eventRegistrations: prev.eventRegistrations.map((reg) =>
										reg.id === eventRegistrationId ? { ...reg, status: 'rejected' } : reg
									)
								};
							})
						);
						console.log('Rejected event registration:', eventRegistrationId);
						toast.success('Die Anmeldung wurde erfolgreich abgelehnt');
					} catch (error) {
						console.error('Error rejecting event registration:', error);
						toast.error('Fehler beim Ablehnen der Anmeldung');
					}
				}}
				onConfirm={async ({ eventRegistrationId }) => {
					try {
						await confirmEventRegistration({ eventRegistrationId }).updates(
							eventRegistrationsQuery.withOverride((prev) => {
								return {
									...prev,
									eventRegistrations: prev.eventRegistrations.map((reg) =>
										reg.id === eventRegistrationId ? { ...reg, status: 'confirmed' } : reg
									)
								};
							})
						);
						console.log('Confirmed event registration:', eventRegistrationId);
						toast.success('Die Anmeldung wurde erfolgreich bestätigt');
					} catch (error) {
						toast.error('Fehler beim Bestätigen der Anmeldung');
						// Re-throw so the dialog component can keep the dialog open on failure
						throw error;
					}
				}}
			/>
			<Pagination.Root
				perPage={eventRegistrationFilters.limit ?? 10}
				page={(eventRegistrationFilters.page ?? 0) + 1}
				count={eventRegistrationsQuery.current?.totalElements ?? 0}
				onPageChange={(pageNumber) => {
					eventRegistrationFilters.page = pageNumber - 1;
				}}
			>
				{#snippet children({ pages, currentPage })}
					<Pagination.Content>
						<Pagination.Item>
							<Pagination.PrevButton>
								<ChevronLeft class="size-4" />
							</Pagination.PrevButton>
						</Pagination.Item>
						{#each pages as page (page.key)}
							{#if page.type === 'ellipsis'}
								<Pagination.Item>
									<Pagination.Ellipsis />
								</Pagination.Item>
							{:else}
								<Pagination.Item>
									<Pagination.Link {page} isActive={currentPage === page.value}>
										{page.value}
									</Pagination.Link>
								</Pagination.Item>
							{/if}
						{/each}
						<Pagination.Item>
							<Pagination.NextButton>
								<ChevronRight class="size-4" />
							</Pagination.NextButton>
						</Pagination.Item>
					</Pagination.Content>
				{/snippet}
			</Pagination.Root>
		</section>
	{/if}
</section>
