<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import * as ToggleGroup from '@/components/ui/toggle-group';
	import * as Avatar from '@/components/ui/avatar';
	import { cn } from '@/utils';
	import { Building, Check, ChevronsUpDown, LoaderCircle, Settings, Users } from '@lucide/svelte';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { Button } from '@/components/ui/button';
	import Search from '@lucide/svelte/icons/search';
	import { toast } from 'svelte-sonner';
	import { _ } from '@services';
	import { Switch } from '@/components/ui/switch';
	import { Label } from '@/components/ui/label';
	import { getOrgs, getOrgMembers } from '@/trpc/routers/admin';

	let orgFilters = $state({
		query: '',
		limit: 10,
		page: 0,
		includeMembersCount: false,
		orderBy: 'createdAt' as const,
		sortDirection: 'desc' as const
	});
	let selectedOrg = $state({
		organizationId: '',
		limit: 10,
		page: 0,
		sort: '+createdAt' as const
	});
	let isOrgsOpen = $state(false);
	let contactPeople: string[] = $state([]);
	let canUploadAdvertisement = $state(false);
	let confirmedRegistration = $state(false);

	interface Props {
		open: boolean;
		onCreateEventRegistration: ({
			eventId,
			organizationId,
			contactPeople,
			canUploadAdvertisement,
			confirmedRegistration
		}: {
			eventId: string;
			organizationId: string;
			contactPeople: string[];
			canUploadAdvertisement: boolean;
			confirmedRegistration: boolean;
		}) => Promise<void>;
	}

	let { open = $bindable(), onCreateEventRegistration }: Props = $props();

	let orgName = $state('');
	let triggerRef = $state<HTMLButtonElement>(null!);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		isOrgsOpen = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}

	function handleOrgSelect(newValue: string) {
		selectedOrg.organizationId = newValue;
		contactPeople = [];
		orgName = getOrgs(orgFilters).current?.data.find((org) => org.id === newValue)?.name ?? '';

		closeAndFocusTrigger();
	}

	function resetDialog() {
		selectedOrg.organizationId = '';
		contactPeople = [];
		canUploadAdvertisement = false;
		confirmedRegistration = false;
		isOrgsOpen = false;
		orgName = '';
		orgFilters.query = '';
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>{$_('modules.admin-create-event-registration.trigger')}</Button>
	</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.admin-create-event-registration.title')}</Dialog.Title>
			<Dialog.Description
				>{$_('modules.admin-create-event-registration.description')}
			</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 w-full">
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-lg flex items-center">
						<Building class="size-5 mr-2" />
						{$_('modules.admin-create-event-registration.org-card-header')}
					</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-2 pt-6">
					<div class="flex items-start">
						<Popover.Root bind:open={isOrgsOpen}>
							{#snippet children()}
								<Popover.Trigger>
									{#snippet child({ props })}
										<Button
											aria-expanded={isOrgsOpen}
											{...props}
											class="w-full justify-between"
											role="combobox"
											variant="outline"
										>
											{orgName || $_('modules.admin-create-event-registration.choose-org')}
											<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-[40ch] p-0">
									<Command.Root shouldFilter={false}>
										<Label class="flex items-center gap-2 py-2">
											<Search class="size-5 ml-2" />
											<input
												bind:value={orgFilters.query}
												class="w-full outline-transparent border-transparent py-2"
												placeholder="Search orgs..."
											/>
										</Label>
										<Command.Separator />
										{#if getOrgs(orgFilters).loading}
											<Command.Loading class="flex items-center justify-center py-2">
												<LoaderCircle class="size-6 text-primary animate-spin" />
											</Command.Loading>
										{:else}
											<Command.List>
												{#each getOrgs(orgFilters).current?.data ?? [] as organization}
													<Command.Item
														value={organization.id}
														onSelect={() => {
															handleOrgSelect(organization.id);
														}}
													>
														<Check
															class={cn(
																'mr-2 size-4',
																selectedOrg.organizationId !== organization.id && 'text-transparent'
															)}
														/>
														{organization.name}
													</Command.Item>
												{/each}
											</Command.List>
										{/if}
										<Command.Empty
											>{$_('modules.admin-create-event-registration.no-orgs-found')}</Command.Empty
										>
									</Command.Root>
								</Popover.Content>
							{/snippet}
						</Popover.Root>
					</div>
				</Card.Content>
			</Card.Root>
			{#if selectedOrg.organizationId}
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-lg flex items-center">
							<Users class="size-5 mr-2" />
							{$_('modules.admin-create-event-registration.members-card-header')}
						</Card.Title>
						<Card.Description></Card.Description>
					</Card.Header>
					<Card.Content class="space-y-6 pt-2">
						{#if getOrgMembers(selectedOrg).loading}
							<LoaderCircle class="size-5 text-primary animate-spin" />
						{:else if getOrgMembers(selectedOrg).ready}
							<ToggleGroup.Root
								type="multiple"
								variant="outline"
								class="flex flex-wrap gap-2"
								bind:value={contactPeople}
							>
								{#each getOrgMembers(selectedOrg).current?.members ?? [] as member}
									<ToggleGroup.Item
										value={member.userId}
										class={cn(
											'flex items-center gap-2 rounded-full px-3 py-1 text-sm',
											'data-[state=on]:bg-primary data-[state=on]:text-primary-foreground'
										)}
										aria-label={`Select ${member.user.name}`}
									>
										<Avatar.Root class="size-6">
											<Avatar.Image src={member?.user.image} alt={member?.user.name} />
											<Avatar.Fallback class="text-xs">
												{member?.user.name
													?.split(' ')
													.map((n) => n[0])
													.join('')}
											</Avatar.Fallback>
										</Avatar.Root>
										<span>{member?.user.name}</span>
									</ToggleGroup.Item>
								{/each}
							</ToggleGroup.Root>
						{/if}
						<div class="text-sm text-muted-foreground">
							<p>
								{$_('modules.admin-create-event-registration.members-selected', {
									values: { members: contactPeople.length }
								})}
							</p>
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
			{#if contactPeople.length > 0}
				<Card.Root>
					<Card.Header class="pb-2">
						<Card.Title class="text-lg flex items-center">
							<Settings class="size-5 mr-2" />
							{$_('modules.admin-create-event-registration.options')}
						</Card.Title>
					</Card.Header>
					<Card.Content class="space-y-6 pt-2">
						<div class="flex flex-row items-center justify-between rounded-lg border p-4">
							<div class="space-y-0.5">
								<Label
									>{$_('modules.admin-create-event-registration.can-upload-advertisements')}</Label
								>
								<p class="text-muted-foreground text-sm">
									{$_(
										'modules.admin-create-event-registration.can-upload-advertisements-description'
									)}
								</p>
							</div>
							<Switch bind:checked={canUploadAdvertisement} />
						</div>
						<div class="flex flex-row items-center justify-between rounded-lg border p-4">
							<div class="space-y-0.5">
								<Label>{$_('modules.admin-create-event-registration.confirmed-registration')}</Label
								>
								<p class="text-muted-foreground text-sm">
									{$_('modules.admin-create-event-registration.confirmed-registration-description')}
								</p>
							</div>
							<Switch bind:checked={confirmedRegistration} />
						</div>
					</Card.Content>
				</Card.Root>
			{/if}
		</div>
		<Dialog.Footer>
			<Button
				disabled={!selectedOrg.organizationId || !contactPeople.length}
				onclick={async () => {
					try {
						await onCreateEventRegistration({
							eventId: page.params.id!,
							organizationId: selectedOrg.organizationId,
							contactPeople,
							canUploadAdvertisement,
							confirmedRegistration
						});
						open = false;
					} catch (e) {
						toast.error('Anmeldung konnte nicht erstellt werden');
					}
				}}
				>{$_('common.submit')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
