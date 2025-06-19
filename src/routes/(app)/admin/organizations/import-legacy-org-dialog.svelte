<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import { cn } from '@/utils';
	import { Building, Check, ChevronsUpDown, LoaderCircle } from '@lucide/svelte';
	import { page } from '$app/state';
	import { tick } from 'svelte';
	import { Button } from '@/components/ui/button';
	import { writable } from 'svelte/store';
	import Search from '@lucide/svelte/icons/search';
	import { toast } from 'svelte-sonner';
	import { _ } from '@services';
	import { trpc } from '@/trpc/client';
	import { debouncer } from '@/stores/debouncer';
	import { Label } from '@/components/ui/label';
	import LegacyOrgDetailsCard from './legacy-org-details-card.svelte';

	let orgFilters = writable({
		query: '',
		size: '10',
		page: '0'
	});
	let selectedOrg = writable('');
	const api = trpc(page);
	const utils = api.createUtils();
	// let organizationMembers = api.admin.orgs.members.getAll.createQuery(selectedOrg);
	let legacyOrgsQuery = api.admin.legacyOrgs.getAll.createQuery(debouncer(orgFilters));
	let importLegacyOrg = api.admin.legacyOrgs.import.createMutation({});
	let isOrgsOpen = $state(false);
	let contactPeople: string[] = $state([]);
	let adminContactPerson: string | null = $state(null);

	let open: boolean = $state(false);

	let orgName = $state('');
	let selectedOrgName = $state('');

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		isOrgsOpen = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}

	let triggerRef = $state<HTMLButtonElement>(null!);

	function handleOrgSelect(newValue: string) {
		$selectedOrg = newValue;
		contactPeople = [];
		selectedOrgName =
			$legacyOrgsQuery.data?.organizations?.find((org) => org.id === newValue)?.name ?? '';

		closeAndFocusTrigger();
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button>{$_('modules.admin-import-legacy-org.trigger')}</Button>
	</Dialog.Trigger>
	<Dialog.Content class="w-full max-w-lg">
		<Dialog.Header>
			<Dialog.Title>{$_('modules.admin-import-legacy-org.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.admin-import-legacy-org.description')}</Dialog.Description>
		</Dialog.Header>
		<div class="space-y-4 w-full max-h-[70dvh] overflow-y-auto">
			<Card.Root>
				<Card.Header class="pb-2">
					<Card.Title class="text-lg flex items-center">
						<Building class="size-5 mr-2" />
						{$_('modules.admin-import-legacy-org.org-card-header')}
					</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-2 pt-6">
					<div class="flex items-start">
						<Popover.Root bind:open={isOrgsOpen}>
							{#snippet children()}
								<Popover.Trigger bind:ref={triggerRef}>
									{#snippet child({ props })}
										<Button
											aria-expanded={isOrgsOpen}
											{...props}
											class="w-full justify-between"
											role="combobox"
											variant="outline"
										>
											{selectedOrgName ||
												$_('modules.admin-import-legacy-org.select-org-placeholder')}
											<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
										</Button>
									{/snippet}
								</Popover.Trigger>
								<Popover.Content class="w-[40ch] p-0">
									<Command.Root shouldFilter={false}>
										<Label class="flex items-center gap-2 py-2">
											<Search class="size-5 ml-2" />
											<input
												bind:value={$orgFilters.query}
												class="w-full outline-transparent border-transparent py-2"
												placeholder="Search orgs..."
											/>
										</Label>
										<Command.Separator />
										<Command.List>
											{#if $legacyOrgsQuery.isLoading}
												<Command.Loading class="flex items-center justify-center py-2">
													<LoaderCircle class="size-6 text-primary animate-spin" />
												</Command.Loading>
											{:else}
												{#each $legacyOrgsQuery.data?.organizations ?? [] as organization}
													<Command.Item
														value={organization.id}
														onSelect={() => {
															handleOrgSelect(organization.id);
														}}
													>
														<Check
															class={cn(
																'mr-2 size-4',
																$selectedOrg !== organization.id && 'text-transparent'
															)}
														/>
														{organization.name}
													</Command.Item>
												{/each}
											{/if}
										</Command.List>
										<Command.Empty
											>{$_('modules.admin-import-legacy-org.no-orgs-found')}</Command.Empty
										>
									</Command.Root>
								</Popover.Content>
							{/snippet}
						</Popover.Root>
					</div>
				</Card.Content>
			</Card.Root>
			{#if $selectedOrg.length > 0}
				<LegacyOrgDetailsCard
					orgId={selectedOrg}
					bind:selectedContacts={contactPeople}
					bind:adminContact={adminContactPerson}
					bind:orgName
				/>
			{/if}
		</div>
		<Dialog.Footer>
			<Button
				disabled={!$selectedOrg || !contactPeople.length}
				onclick={() => {
					$importLegacyOrg.mutate(
						{
							legacyOrgId: $selectedOrg,
							request: {
								adminContactPerson: adminContactPerson !== null ? adminContactPerson : undefined,
								contactPeople,
								organizationName: orgName
							}
						},
						{
							onError: () => {
								toast.error('Organisation konnte nicht importiert werden');
							},
							onSuccess: async () => {
								open = false;
								toast.success('Organisation erfolgreich importiert');
								await utils.admin.orgs.list.invalidate();
							}
						}
					);
				}}
				>{$_('common.submit')}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
