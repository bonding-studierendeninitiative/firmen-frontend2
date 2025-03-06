<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import * as ToggleGroup from '@/components/ui/toggle-group';
	import * as Avatar from '@/components/ui/avatar';
	import { cn } from '@/utils';
	import { Building, Check, ChevronsUpDown, LoaderCircle, Settings, Users } from 'lucide-svelte';
	import { type Organization, type OrganizationMembership } from 'svelte-clerk/server';
	import { getContext, onMount, tick } from 'svelte';
	import { Button } from '@/components/ui/button';
	import type { AdminRegisterOrganizationToEvent } from '@schema';
	import { type Infer, superForm, type SuperValidated } from 'sveltekit-superforms';
	import type { Writable } from 'svelte/store';
	import Search from 'lucide-svelte/icons/search';
	import { Label } from 'flowbite-svelte';
	import { toast } from 'svelte-french-toast';
	import { _ } from '@services';
	import { Switch } from '@/components/ui/switch';
	import { Description, Field } from '@/components/ui/form';
	import { Control } from 'formsnap';

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
				reset();
				toast.success('Anmeldung erfolgreich erstellt');
			} else if (result.status === 409) {
				toast.error('Diese Organisation ist bereits angemeldet');
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

	function handleOrgSelect(newValue: string, ids: { trigger: string }) {
		$formData.organizationId = newValue;
		$formData.contactPeople = [];
		orgName = organizations.find(org => org.id === $formData.organizationId)?.name;
		loadOrgMembers(newValue);
		closeAndFocusTrigger(ids.trigger);
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>{$_("modules.admin-create-event-registration.trigger")}</Button>
	</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{$_("modules.admin-create-event-registration.title")}</Dialog.Title>
			<Dialog.Description>{$_("modules.admin-create-event-registration.description")}
			</Dialog.Description>
		</Dialog.Header>
		<form action="?/createRegistration" id="createAdminEventRegistration" method="POST" use:enhance>
			<div class="space-y-4 w-full">
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-lg flex items-center">
							<Building class="h-5 w-5 mr-2" />
							{$_("modules.admin-create-event-registration.org-card-header")}
						</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-2 pt-6">
						<div class="flex items-start">
							<Popover.Root bind:open={isOrgsOpen} let:ids>
								<Popover.Trigger asChild let:builder>
									<Button
										aria-expanded={isOrgsOpen}
										builders={[builder]}
										class="w-full justify-between"
										role="combobox"
										variant="outline"
									>
										{orgName}
										<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</Popover.Trigger>
								<Popover.Content class="w-[40ch] p-0">
									<Command.Root shouldFilter={false}>
										<Label class="flex items-center gap-2 py-2">
											<Search class="h-5 w-5 ml-2" />
											<input bind:value={orgQuery} class="w-full outline-transparent border-transparent py-2"
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
              handleOrgSelect(currentValue, ids);
            }}>
														<Check
															class={
															cn(
                "mr-2 h-4 w-4",
                $formData.organizationId !== organization.id && "text-transparent"
              )}
														/>
														{organization.name}
													</Command.Item>
												{/each}
											</Command.List>
										{/if}
										<Command.Empty>{$_("modules.admin-create-event-registration.no-orgs-found")}</Command.Empty>
									</Command.Root>
								</Popover.Content>
							</Popover.Root>
						</div>
					</Card.Content>
				</Card.Root>
				<input name="organizationId" type="hidden" value={$formData.organizationId} />
				{#if $formData.organizationId}
					<Card.Root>
						<Card.Header class="pb-2">
							<Card.Title class="text-lg flex items-center">
								<Users class="h-5 w-5 mr-2" />
								{$_("modules.admin-create-event-registration.members-card-header")}
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
								<p>{$_("modules.admin-create-event-registration.members-selected", { values: { members: $formData.contactPeople.length } })}</p>
							</div>
						</Card.Content>
					</Card.Root>
				{/if}
				{#if $formData.contactPeople.length > 0}
					<Card.Root>
						<Card.Header class="pb-2">
							<Card.Title class="text-lg flex items-center">
								<Settings class="h-5 w-5 mr-2" />
								{$_("modules.admin-create-event-registration.options")}
							</Card.Title>
						</Card.Header>
						<Card.Content class="space-y-6 pt-2">
							<Field
								form={superform}
								name="canUploadAdvertisement"
								class="flex flex-row items-center justify-between rounded-lg border p-4"
							>
								<Control let:attrs>
									<div class="space-y-0.5">
										<Label>{$_("modules.admin-create-event-registration.can-upload-advertisements")}</Label>
										<Description>
											{$_("modules.admin-create-event-registration.can-upload-advertisements-description")}
										</Description>
									</div>
									<Switch
										includeInput
										{...attrs}
										bind:checked={$formData.canUploadAdvertisement}
									/>
								</Control>
							</Field>
						</Card.Content>
					</Card.Root>
				{/if}
				<input name="contactPeople" type="hidden" value={$formData.contactPeople} />
			</div>
		</form>
		<Dialog.Footer>
			<Button disabled={!$formData.eventId || !$formData.organizationId || !$formData.contactPeople.length}
							form="createAdminEventRegistration"
							type="submit">{$_("common.submit")}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>