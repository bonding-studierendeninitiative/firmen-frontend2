<script lang="ts">
	import { Sidebar } from '$lib/@svelte/modules';
	import Check from 'lucide-svelte/icons/check';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { currentOrganization } from '$lib/stores/organizationStore';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import * as Command from '$lib/components/ui/command';
	import * as Popover from '$lib/components/ui/popover';
	import { _ } from '@services/i18n';
	import { Button } from '$lib/components/ui/button';
	import PlusCircled from 'svelte-radix/PlusCircled.svelte';

	import { cn } from '$lib/utils.js';
	import { tick } from 'svelte';
	import { Building } from 'lucide-svelte';
	import { CreateOrganization } from '@/@svelte/modules/CreateOrganization';
	export let data: PageData;
	let orgs = data.orgs ?? [];
	let items: {
		value: string;
		name: string;
	}[] = [];

	// Reactive statement to update orgs and items when data.orgs changes
	$: if (data.orgs) {
		orgs = data.orgs;
		items = orgs.map((org) => ({ value: org.organizationSlug, name: org.organizationName }));
	}

	// Reactive statement to set the current organization when orgs are available
	$: if (orgs.length > 0) {
		const orgSlug = data.organization?.slug;
		currentOrganization.set(orgs.find((org) => org.organizationSlug === orgSlug));
	}

	function switchOrganization(value: string) {
		if (value) {
			currentOrganization.set(orgs?.find((org) => org.organizationSlug === value));
			goto(`/${value}/dashboard`);
		}
	}
	let popoverOpen = false;
	let createOrgDialogOpen = false;
	let value = '';
	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		popoverOpen = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}
</script>

<div class=" lg:flex w-full">
	<Sidebar>
		<span class="text-white pb-3 inline-block">Meine Organisationen</span>
		{#if orgs.length >= 1}
			<Popover.Root
				bind:open={popoverOpen}
				let:ids
				class="relative px-4 py-3 flex items-center space-x-4 rounded-lg"
			>
				<Popover.Trigger asChild let:builder>
					<Button
						builders={[builder]}
						variant="outline"
						role="combobox"
						aria-expanded={popoverOpen}
						class="w-full justify-between"
						>{$currentOrganization?.organizationName}
						<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" /></Button
					>
				</Popover.Trigger>
				<Popover.Content class="p-0">
					<Command.Root>
						<Command.Input
							placeholder={$_(
								'user-pages.organizations.createOrganization.placeholders.searchOrganization'
							)}
						/>
						<Command.Empty>{$_('user-pages.organizations.noOrgMembershipsFound')}</Command.Empty>
						<Command.Group>
							{#each orgs as currentOrg}
								<Command.Item
									value={currentOrg.organizationSlug}
									onSelect={(currentValue) => {
										switchOrganization(currentValue);
										closeAndFocusTrigger(ids.trigger);
									}}
								>
									<Building class="mr-2 h-4 w-4" />
									{currentOrg.organizationName}
									<Check
										class={cn(
											'mr-2 h-4 w-4',
											value !== currentOrg.organizationSlug && 'text-transparent'
										)}
									/>
								</Command.Item>
							{/each}
						</Command.Group>
						<Command.Separator />
						<Command.Group>
							<Command.Item
								onSelect={() => {
									closeAndFocusTrigger(ids.trigger);
									createOrgDialogOpen = true;
								}}
								><PlusCircled class="mr-2 h-4 w-4" />
								Create Team</Command.Item
							>
						</Command.Group>
					</Command.Root>
				</Popover.Content>
			</Popover.Root>
			<!--<Select
				value={$currentOrganization?.organizationSlug}
				handleInput={switchOrganization}
				placeholder="Organization"
				{items}
			/>-->
		{:else}
			<a
				class={`animate-pulse font-extrabold relative px-4 py-3 flex justify-center items-center space-x-4 rounded-lg text-brand bg-white`}
				href="/create-organization">Create Org now</a
			>
		{/if}
	</Sidebar>

	<div class="h-[100dvh] w-full overflow-y-scroll">
		<div class="w-full px-16 py-22 bg-white">
			<slot />
		</div>
	</div>
	<CreateOrganization bind:isOpen={createOrgDialogOpen} validated={data.form} />
</div>
