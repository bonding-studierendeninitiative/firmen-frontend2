<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import * as ToggleGroup from '@/components/ui/toggle-group';
	import * as Avatar from '@/components/ui/avatar';
	import { cn } from '@/utils';
	import { Building, Check, ChevronsUpDown, LoaderCircle, Users } from 'lucide-svelte';
	import { type Organization, type OrganizationMembership } from 'svelte-clerk/server';
	import { getContext, onMount, tick } from 'svelte';
	import { Button } from '@/components/ui/button';
	import type { AdminRegisterOrganizationToEvent } from '@schema';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { Writable } from 'svelte/store';
	import Search from 'lucide-svelte/icons/search';
	import { Label } from 'flowbite-svelte';
	import { toast } from 'svelte-french-toast';

	let organizations: Organization[] = [];
	let organizationMembers: OrganizationMembership[] = [];
	let isLoadingOrgs = false;
	let orgQuery = '';
	let isLoadingMembers = false;
	let isOrgsOpen = false;
	let timeout = null;
	export let open: boolean;

	let createForm: Writable<SuperValidated<Infer<AdminRegisterOrganizationToEvent>>> = getContext('createRegistrationForm');

	let orgName = '';

	let superform = superForm($createForm, {
		dataType: 'json',
		onResult: ({ result }) => {
			if (result.type === 'success') {
				open = false;
				reset()
				toast.success('Anmeldung erfolgreich erstellt');
			} else {
				toast.error('Anmeldung konnte nicht erstellt werden');
			}
		}
	});

	let { form: formData, enhance, reset } = superform;

	function handle_search() {
		isLoadingOrgs = true;
		if (timeout) clearTimeout(timeout);
		timeout = setTimeout(loadOrgs, 300);
	}

	async function loadOrgs() {
		const searchParams = new URLSearchParams();
		searchParams.append('q', orgQuery);
		const orgs = await fetch(`/admin/api/organizations/?${searchParams}`, { method: 'GET', headers: {} });
		organizations = await orgs.json();
		isLoadingOrgs = false;
	}

	async function loadOrgMembers(orgId: string) {
		isLoadingMembers = true;
		const orgMembers = await fetch(`/admin/api/organizations/${orgId}/members`, { method: 'GET', headers: {} });
		organizationMembers = await orgMembers.json();
		isLoadingMembers = false;
	}

	onMount(async () => {
		await loadOrgs();
	});

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		isOrgsOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>Neue Anmeldung</Button>
	</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-lg">
		<Dialog.Header>
			<Dialog.Title>Neue Anmeldung</Dialog.Title>
			<Dialog.Description>Erstelle hier eine neue Anmeldung für eine existierende Organisation
			</Dialog.Description>
		</Dialog.Header>
		<form id="createAdminEventRegistration" method="POST" action="?/createRegistration" use:enhance>
			<div class="space-y-4 w-full">
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-lg flex items-center">
							<Building class="h-5 w-5 mr-2" />
							Organisation
						</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-2 pt-6">
						<div class="flex items-start">
							<Popover.Root bind:open={isOrgsOpen} let:ids>
								<Popover.Trigger asChild let:builder>
									<Button
										builders={[builder]}
										variant="outline"
										role="combobox"
										aria-expanded={isOrgsOpen}
										class="w-full justify-between"
									>
										{orgName}
										<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</Popover.Trigger>
								<Popover.Content class="w-[40ch] p-0">
									<Command.Root shouldFilter={false}>
										<Label class="flex items-center gap-2 py-2">
											<Search class="h-5 w-5 ml-2" />
											<input class="w-full outline-transparent border-transparent py-2" bind:value={orgQuery}
														 on:input={handle_search} placeholder="Search orgs..." />
										</Label>
										<Command.Separator />
										{#if isLoadingOrgs}
											<Command.Loading class="flex items-center justify-center py-2">
												<LoaderCircle class="h-6 w-6 text-primary animate-spin" />
											</Command.Loading>
										{:else}
											<Command.List>
												{#each organizations as organization}
													<Command.Item
														value={organization.id}
														onSelect={(currentValue) => {
              $formData.organizationId = currentValue;
							$formData.contactPeople = [];
							orgName = organizations.find(org => org.id === $formData.organizationId)?.name
							loadOrgMembers(currentValue);
              closeAndFocusTrigger(ids.trigger);
            }}
													>
														<Check
															class={cn(
                "mr-2 h-4 w-4",
                $formData.organizationId !== organization.id && "text-transparent"
              )}
														/>
														{organization.name}
													</Command.Item>
												{/each}
											</Command.List>
										{/if}
										<Command.Empty>No orgs found.</Command.Empty>
									</Command.Root>
								</Popover.Content>
							</Popover.Root>
						</div>
					</Card.Content>
				</Card.Root>
				<input type="hidden" value={$formData.organizationId} name="organizationId" />
				{#if $formData.organizationId}
					<Card.Root>
						<Card.Header class="pb-2">
							<Card.Title class="text-lg flex items-center">
								<Users class="h-5 w-5 mr-2" />
								Ansprechpersonen
							</Card.Title>
							<Card.Description></Card.Description>
						</Card.Header>
						<Card.Content class="space-y-6 pt-2">
							{#if isLoadingMembers}
								<LoaderCircle class="h-5 w-5 text-primary animate-spin" />
							{:else}
								<ToggleGroup.Root
									type="multiple"
									variant="outline"
									class="flex flex-wrap gap-2"
									bind:value={$formData.contactPeople}
								>
									{#each organizationMembers as member}
										<ToggleGroup.Item
											value={member.publicUserData?.userId}
											class={cn(
										"flex items-center gap-2 rounded-full px-3 py-1 text-sm",
										"data-[state=on]:bg-primary data-[state=on]:text-primary-foreground",
									)}
											aria-label={`Select ${member.publicUserData?.firstName} ${member.publicUserData?.lastName}`}
										>
											<Avatar.Root class="h-6 w-6">
												<Avatar.Image src={member.publicUserData?.imageUrl}
																			alt={member.publicUserData?.firstName + " " + member.publicUserData?.lastName} />
												<Avatar.Fallback class="text-xs">
													{[member.publicUserData?.firstName[0], member.publicUserData?.lastName[0]].join("")}
												</Avatar.Fallback>
											</Avatar.Root>
											<span>{member.publicUserData?.firstName + " " + member.publicUserData?.lastName}</span>
										</ToggleGroup.Item>
									{/each}
								</ToggleGroup.Root>
							{/if}
							<div class="text-sm text-muted-foreground">
								{#if $formData.contactPeople.length > 0}
									<p>
										{$formData.contactPeople.length} member{$formData.contactPeople.length !== 1 ? "s" : ""} selected
									</p>
								{:else}
									<p>No members selected</p>
								{/if}
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
				<input type="hidden" value={$formData.contactPeople} name="contactPeople" />
			</div>
		</form>
		<Dialog.Footer>
			<Button form="createAdminEventRegistration" type="submit"
							disabled={!$formData.eventId || !$formData.organizationId || !$formData.contactPeople.length}>Speichern
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>