<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import * as ToggleGroup from '@/components/ui/toggle-group';
	import * as Avatar from '@/components/ui/avatar';
	import { cn } from '@/utils';
	import { Building, Check, ChevronsUpDown, LoaderCircle, Settings, Users } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { tick } from 'svelte';
	import { Button } from '@/components/ui/button';
	import { writable } from 'svelte/store';
	import Search from 'lucide-svelte/icons/search';
	import { toast } from 'svelte-french-toast';
	import { _ } from '@services';
	import { Switch } from '@/components/ui/switch';
	import { trpc } from '@/trpc/client';
	import { debouncer } from '@/stores/debouncer';
	import { Label } from '@/components/ui/label';

	let orgFilters = writable({
		query: '',
		limit: 10,
		page: 0,
		includeMembersCount: false,
		orderBy: "-created_at" as const
	});
	let selectedOrg = writable({
		organizationId: '',
		limit: 10,
		page: 0,
		sort: "+created_at" as const
	});
	const api = trpc($page);
	const utils = api.createUtils();
	let organizationMembers = api.admin.orgs.members.getAll.createQuery(selectedOrg);
	let organizations = api.admin.orgs.list.createQuery(debouncer(orgFilters));
	const createEventRegistration = api.admin.eventRegistrations.create.createMutation();
	let isOrgsOpen = false;
	let contactPeople: string[] = [];
	let canUploadAdvertisement = false;

	export let open: boolean;

	let orgName = '';

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
		$selectedOrg.organizationId = newValue;
		contactPeople = [];
		orgName = $organizations.data?.data.find(org => org.id === newValue)?.name;

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
										<input bind:value={$orgFilters.query} class="w-full outline-transparent border-transparent py-2"
													 placeholder="Search orgs..." />
									</Label>
									<Command.Separator />
									{#if $organizations.isLoading}
										<Command.Loading class="flex items-center justify-center py-2">
											<LoaderCircle class="h-6 w-6 text-primary animate-spin" />
										</Command.Loading>
									{:else}
										<Command.List>
											{#each $organizations.data?.data ?? [] as organization}
												<Command.Item
													value={organization.id}
													onSelect={(currentValue) => {
              handleOrgSelect(currentValue, ids);
            }}>
													<Check
														class={
															cn(
                "mr-2 h-4 w-4",
                $selectedOrg.organizationId !== organization.id && "text-transparent"
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
			{#if $selectedOrg.organizationId}
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-lg flex items-center">
							<Users class="h-5 w-5 mr-2" />
							{$_("modules.admin-create-event-registration.members-card-header")}
						</Card.Title>
						<Card.Description></Card.Description>
					</Card.Header>
					<Card.Content class="space-y-6 pt-2">
						{#if $organizationMembers.isLoading}
							<LoaderCircle class="h-5 w-5 text-primary animate-spin" />
						{:else}
							<ToggleGroup.Root
								type="multiple"
								variant="outline"
								class="flex flex-wrap gap-2"
								bind:value={contactPeople}
							>
								{#each $organizationMembers.data?.data ?? [] as member}
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
							<p>{$_("modules.admin-create-event-registration.members-selected", { values: { members: contactPeople.length } })}</p>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
			{#if contactPeople.length > 0}
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-lg flex items-center">
							<Settings class="h-5 w-5 mr-2" />
							{$_("modules.admin-create-event-registration.options")}
						</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-6 pt-2">
						<div
							class="flex flex-row items-center justify-between rounded-lg border p-4"
						>
							<div class="space-y-0.5">
								<Label>{$_("modules.admin-create-event-registration.can-upload-advertisements")}</Label>
								<p class="text-muted-foreground text-sm">
									{$_("modules.admin-create-event-registration.can-upload-advertisements-description")}
								</p>
							</div>
							<Switch
								includeInput
								bind:checked={canUploadAdvertisement}
							/>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
		<Dialog.Footer>
			<Button disabled={!$selectedOrg.organizationId || !contactPeople.length}
							on:click={() => {
								$createEventRegistration.mutate({
									eventId: $page.params.id,
	organizationId: $selectedOrg.organizationId,
	contactPeople,
	canUploadAdvertisement
								}, {
									onError: () => {
				toast.error('Anmeldung konnte nicht erstellt werden');
									},
									onSuccess: async () => {
										open = false;
				toast.success('Anmeldung erfolgreich erstellt');
										await utils.admin.events.getEventRegistrations.invalidate({
											eventId: $page.params.id
										})
									}
								})
							}}>{$_("common.submit")}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>