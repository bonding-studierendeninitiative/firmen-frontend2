<script lang="ts">
	import { _ } from '@services';
	import { NoDataFound } from '@/@svelte/components';
	import { LoaderCircle } from '@lucide/svelte';
	import { fade } from 'svelte/transition';
	import { page } from '$app/state';
	import DataTable from './data-table.svelte';
	import {
		confirmEventRegistration,
		createEventRegistration,
		deleteEventRegistration,
		getEventRegistrations,
		rejectEventRegistration
	} from '@/trpc/routers/admin';
	import { toast } from 'svelte-sonner';

	let eventRegistrationFilters = $derived({
		limit: 10,
		eventId: page.params.id!
	});
</script>

{#if getEventRegistrations(eventRegistrationFilters).loading}
	<LoaderCircle class="size-10 mx-auto animate-spin" />
{:else if getEventRegistrations(eventRegistrationFilters).ready}
	<section in:fade class=" mt-6">
		{#if Number(getEventRegistrations(eventRegistrationFilters).current?.eventRegistrations.length) < 1}
			<section class=" mt-10">
				<NoDataFound
					heading={$_('admin-pages.events.noRegistrationsFound')}
					subHeading={$_('admin-pages.events.noDataToDisplay')}
					buttonText={$_('admin-pages.events.backToEvents')}
					onButtonClick={() => {}}
				/>
			</section>
		{:else}
			<section class=" mt-10">
				<DataTable
					isLoading={getEventRegistrations(eventRegistrationFilters).loading}
					data={getEventRegistrations(eventRegistrationFilters).current?.eventRegistrations ?? []}
					onDelete={async ({ eventRegistrationId }) => {
						try {
							await deleteEventRegistration({ eventRegistrationId }).updates(
								getEventRegistrations(eventRegistrationFilters).withOverride((prev) => {
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
								getEventRegistrations(eventRegistrationFilters).withOverride((prev) => {
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
								getEventRegistrations(eventRegistrationFilters).withOverride((prev) => {
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
					onCreateEventRegistration={async ({
						eventId,
						organizationId,
						contactPeople,
						canUploadAdvertisement,
						confirmedRegistration
					}) => {
						try {
							await createEventRegistration({
								eventId,
								organizationId,
								contactPeople,
								canUploadAdvertisement,
								confirmedRegistration
							}).updates(
								getEventRegistrations(eventRegistrationFilters).withOverride((prev) => {
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
					}}
				/>
			</section>
		{/if}
	</section>
{/if}
