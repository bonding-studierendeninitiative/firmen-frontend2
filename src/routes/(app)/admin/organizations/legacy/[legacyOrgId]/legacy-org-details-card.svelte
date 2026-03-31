<script lang="ts">
	import {
		ChevronDown,
		ChevronUp,
		Mail,
		Phone,
		Globe,
		MapPin,
		File,
		User,
		LoaderCircle,
		Check,
		Shield
	} from '@lucide/svelte';
	import * as Card from '$lib/components/ui/card';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '@/components/ui/button';
	import { _ } from '@services';
	import type { LegacyOrganizationOutput_Detailed } from '@api/admin-client';
	import { Input } from '@/components/ui/input';
	import { getLegacyOrgDetails } from '@/remote/functions/admin';

	let {
		orgId,
		selectedContacts = $bindable([]),
		adminContact = $bindable(null),
		orgName = $bindable()
	}: Props = $props();

	type ContactPerson = Exclude<
		LegacyOrganizationOutput_Detailed['contactPeople'],
		undefined
	>[number];

	// Derived values with fallbacks
	// State for contact people accordion
	let contactsExpanded = $state(false);

	interface Props {
		orgId: string;
		// State for selected contacts and roles
		selectedContacts?: string[];
		adminContact?: string | null;
		orgName: string;
	}

	let orgDetailsQuery = $derived(getLegacyOrgDetails({ orgId }));

	$effect(() => {
		if (orgDetailsQuery.current?.name) {
			orgName = orgDetailsQuery.current.name;
		}
	});

	// Helper function to get initials from name
	function getInitials(name: string): string {
		return name
			.split(' ')
			.map((part) => part.charAt(0))
			.join('')
			.substring(0, 2)
			.toUpperCase();
	}

	// Helper function to format contact name
	function formatContactName(contact: ContactPerson): string {
		const parts = [];
		if (contact.title) parts.push(contact.title);
		if (contact.firstName) parts.push(contact.firstName);
		if (contact.lastName) parts.push(contact.lastName);
		return parts.length > 0 ? parts.join(' ') : 'Unknown Contact';
	}

	// Toggle contact selection
	function toggleContactSelection(contact: ContactPerson) {
		const contactId = contact.legacyId;
		if (selectedContacts.includes(contactId)) {
			selectedContacts = selectedContacts.filter((id) => id !== contactId);
			// If the admin contact is deselected, remove admin role
			if (adminContact === contactId) {
				adminContact = null;
			}
		} else {
			selectedContacts = [...selectedContacts, contactId];
		}
	}
	// Computed property to check if multiple contacts are selected
	let multipleContactsSelected = $derived(selectedContacts.length > 1);

	// Set admin role for a contact
	function setAdminRole(contactId: string) {
		adminContact = contactId;
	}

	// Check if a contact is selected
	function isContactSelected(contact: ContactPerson): boolean {
		return selectedContacts.includes(contact.legacyId);
	}
</script>

<section class="w-full max-w-2xl">
	{#if orgDetailsQuery.loading}
		<LoaderCircle class="animate-spin mx-auto size-10" />
	{:else}
		{@const organization = orgDetailsQuery.current}
		{@const hasAddress =
			organization?.address &&
			(organization?.address.street ||
				organization?.address.location ||
				organization?.address.postCode ||
				organization?.address.country)}
		{@const hasContactPeople =
			organization?.contactPeople && organization?.contactPeople.length > 0}

<Input class="text-xl font-bold w-full" bind:value={orgName} />
			<div class="flex items-start justify-between pb-4">
				{#if organization?.corporation}
					<Card.Description>{organization?.corporation}</Card.Description>
				{/if}
				{#if organization?.supplierType}
					<Badge variant="outline" class="ml-2">
						{organization?.supplierType}
					</Badge>
				{/if}
			</div>

		<div class="space-y-4">
			<!-- Contact Information -->
			<div class="space-y-2">
				{#if organization?.email}
					<div class="flex items-center gap-2">
						<Mail class="size-4 text-muted-foreground" />
						<a href="mailto:{organization?.email}" class="text-sm hover:underline"
							>{organization?.email}</a
						>
					</div>
				{/if}

				{#if organization?.internet}
					<div class="flex items-center gap-2">
						<Globe class="size-4 text-muted-foreground" />
						<a
							href={organization?.internet.startsWith('http')
								? organization?.internet
								: 'https://' + organization?.internet}
							target="_blank"
							rel="noopener noreferrer"
							class="text-sm hover:underline"
						>
							{organization?.internet}
						</a>
					</div>
				{/if}

				{#if organization?.fax}
					<div class="flex items-center gap-2">
						<File class="size-4 text-muted-foreground" />
						<span class="text-sm">{organization?.fax}</span>
					</div>
				{/if}
			</div>

			<!-- Address Information -->
			{#if hasAddress}
				<div class="rounded-md border p-3 space-y-1">
					<div class="flex items-center gap-2 mb-1">
						<MapPin class="size-4 text-muted-foreground" />
						<span class="font-medium text-sm">{$_('modules.admin-import-legacy-org.address')}</span>
					</div>

					{#if organization?.address?.street}
						<p class="text-sm">{organization?.address.street}</p>
					{/if}

					<p class="text-sm">
						{#if organization?.address?.location}
							{organization?.address.location}
						{/if}{#if organization?.address?.postCode}{#if organization?.address?.location},{/if}
							{organization?.address.postCode}
						{/if}
					</p>

					{#if organization?.address?.country}
						<p class="text-sm">{organization?.address.country}</p>
					{/if}

					{#if organization?.address?.phone}
						<div class="flex items-center gap-2 mt-2">
							<Phone class="size-4 text-muted-foreground" />
							<a href="tel:{organization?.address.phone}" class="text-sm hover:underline"
								>{organization?.address.phone}</a
							>
						</div>
					{/if}
				</div>
			{/if}

			<!-- Contact People -->
			{#if hasContactPeople}
				<div class="mt-4">
					<button
						class="flex w-full items-center justify-between rounded-md border p-3 text-left font-medium"
						onclick={() => (contactsExpanded = !contactsExpanded)}
					>
						<div class="flex items-center gap-2">
							<User class="size-4 text-muted-foreground" />
							<span
								>{`${$_('modules.admin-import-legacy-org.contact-people')} (${selectedContacts.length}/${organization?.contactPeople?.length || 0})`}</span
							>
						</div>
						{#if contactsExpanded}
							<ChevronUp class="size-4" />
						{:else}
							<ChevronDown class="size-4" />
						{/if}
					</button>

					{#if contactsExpanded}
						<div class="mt-2 space-y-3">
							{#each organization?.contactPeople || [] as contact}
								<div class="rounded-md border p-3">
									<div class="flex items-start gap-3">
										<!-- Selectable Avatar -->
										<button
											class="relative size-10 rounded-full overflow-hidden focus:outline-hidden focus:ring-2 focus:ring-primary focus:ring-offset-2"
											onclick={() => toggleContactSelection(contact)}
											aria-label={isContactSelected(contact)
												? 'Deselect contact'
												: 'Select contact'}
										>
											<Avatar.Root
												class={`size-10 ${isContactSelected(contact) ? 'bg-primary' : 'bg-muted'} text-secondary-foreground transition-colors`}
											>
												{#if isContactSelected(contact)}
													<div
														class="absolute inset-0 flex items-center justify-center bg-primary text-primary-foreground"
													>
														<Check class="size-5" />
													</div>
												{:else}
													<Avatar.Fallback>
														{getInitials(formatContactName(contact))}
													</Avatar.Fallback>
												{/if}
											</Avatar.Root>
										</button>

										<div class="space-y-1 flex-1">
											<div class="flex items-center justify-between">
												<p class="font-medium">{formatContactName(contact)}</p>

												<!-- Role selector (visible when multiple contacts are selected) 
												{#if multipleContactsSelected && isContactSelected(contact)}-->
												<div class="flex items-center gap-2">
													<Button
														variant={adminContact === contact.legacyId ? 'default' : 'ghost'}
														size="icon"
														title={adminContact === contact.legacyId ? 'Admin' : 'Make Admin'}
														class={[
															'size-7 text-xs',
															(!multipleContactsSelected || !isContactSelected(contact)) &&
																'invisible'
														]}
														onclick={() => setAdminRole(contact.legacyId)}
													>
														<Shield class="size-3" />
													</Button>
												</div>
												<!--{/if}-->
											</div>
											{#if contact.position}
												<p class="text-sm text-muted-foreground">{contact.position}</p>
											{/if}

											{#if contact.department}
												<p class="text-sm text-muted-foreground">{contact.department}</p>
											{/if}

											<div class="mt-2 space-y-1">
												{#if contact.email}
													<div class="flex items-center gap-2">
														<Mail class="size-3 text-muted-foreground" />
														<a href="mailto:{contact.email}" class="text-xs hover:underline"
															>{contact.email}</a
														>
													</div>
												{/if}

												{#if contact.phone}
													<div class="flex items-center gap-2">
														<Phone class="size-3 text-muted-foreground" />
														<a href="tel:{contact.phone}" class="text-xs hover:underline"
															>{contact.phone}</a
														>
													</div>
												{/if}

												{#if contact.phone2}
													<div class="flex items-center gap-2">
														<Phone class="size-3 text-muted-foreground" />
														<a href="tel:{contact.phone2}" class="text-xs hover:underline"
															>{contact.phone2}</a
														>
													</div>
												{/if}

												{#if contact.fax}
													<div class="flex items-center gap-2">
														<File class="size-3 text-muted-foreground" />
														<span class="text-xs">{contact.fax}</span>
													</div>
												{/if}
											</div>

											{#if contact.remarks}
												<p class="text-xs italic mt-2">{contact.remarks}</p>
											{/if}
										</div>
									</div>
								</div>
							{/each}
						</div>
					{/if}
				</div>
			{/if}
		</div>
	{/if}
</section>
