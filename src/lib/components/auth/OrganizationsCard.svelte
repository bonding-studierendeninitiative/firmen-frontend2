<script lang="ts">
	import { cn } from '@/utils';
	import * as Card from '@/components/ui/card';
	import { Badge } from '@/components/ui/badge';
	import { Users, Plus, Building2, Settings } from '@lucide/svelte';
	import { createOrganizationByUserForm } from '@/remote/functions';
	import { Button } from '@/components/ui/button';
	import { Label } from '@/components/ui/label';
	import { Input } from '@/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { LoaderCircle } from '@lucide/svelte';
	import { _ } from '@services';

	let createOrganisationOpen = $state(false);
	let pending = $state(false);
	const { name } = createOrganizationByUserForm.fields;

	interface Organization {
		id: string;
		name: string;
		slug: string;
		logo?: string | null | undefined | undefined;
		members: Array[any];
		metadata?: any;
	}

	interface Props {
		localization?: any;
		organizations?: Organization[];
		currentOrganization?: Organization;
		onSelectOrganization?: (org: Organization) => void;
		onManageOrganization?: (org: Organization) => void;
	}

	let {
		localization = {},
		organizations = [],
		currentOrganization,
		onSelectOrganization,
		onManageOrganization
	}: Props = $props();

	// Filter out personal account from organizations list
	let orgList = $derived(organizations.filter((org) => !org.isPersonal));
</script>

<Card.Root class="w-full h-96 flex flex-col">
	<Card.Header>
		<div class="flex items-center justify-between">
			<div class="space-y-1">
				<Card.Title class="flex items-center gap-2">
					<Building2 class="size-5" />
					{$_('onboarding.organizations')}
				</Card.Title>
				<Card.Description>
					{$_('onboarding.chooseorganization')}
				</Card.Description>
			</div>
			{#if orgList.length > 0}
				<Button size="sm" class="ml-4" onclick={() => (createOrganisationOpen = true)}>
					<Plus class="mr-2 size-4" />
					{$_("onboarding.createorg")}
				</Button>
			{/if}
		</div>
	</Card.Header>

	<Card.Content class={cn(
        'space-y-4 flex-1 w-full pr-2 min-w-90',
        (orgList.length > 0 || createOrganisationOpen) && 'overflow-y-auto'
    )}>
		{#if createOrganisationOpen}
			<form
				{...createOrganizationByUserForm.enhance(async ({ submit }) => {
					try {
						pending = true;
						await submit();
						pending = false;
						createOrganisationOpen = false;
					} catch (e) {
						console.error(e);
						toast.error(e?.body?.message);
						pending = false;
					}
				})}
				id="create-org-form"
			>
				<div class="flex flex-col gap-1">
					<Label>{$_('admin-pages.organizations.name')}</Label>
					<Input
						{...name.as('text')}
						placeholder={$_(
							'user-pages.organizations.createOrganization.placeholders.organizationName'
						)}
					/>
				</div>
			</form>
		{:else if orgList.length === 0}
			<!-- Empty state -->
			<div class="text-center py-8 space-y-4">
				<div class="flex justify-center">
					<div class="rounded-full bg-muted p-3">
						<Building2 class="size-6 text-muted-foreground" />
					</div>
				</div>
				<div class="space-y-2">
					<h3 class="font-medium">
						{$_('onboarding.organizations')}
					</h3>
					<p class="text-sm text-muted-foreground max-w-sm mx-auto">
						{$_("onboarding.emptydescription")}
					</p>
				</div>
					<Button onclick={() => (createOrganisationOpen = true)}>
						<Plus class="mr-2 size-4" />
						{$_("onboarding.createfirstorg")}
					</Button>
			</div>
		{:else}
			<!-- Organizations list -->
			<div class="space-y-3">
				{#each orgList as org}
					{@const membersCount = org.members.length}

					<button
						class={cn(
							'flex w-full items-center justify-between p-4 rounded-lg border transition-colors',
							'hover:bg-accent cursor-pointer',
							currentOrganization?.id === org.id && 'border-primary bg-primary/5'
						)}
						onclick={() => onSelectOrganization?.(org)}
						tabindex="0"
						onkeydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								e.preventDefault();
								onSelectOrganization?.(org);
							}
						}}
					>
						<div class="flex items-center gap-3">
							{#if org.logo}
								<img src={org.logo} alt={org.name} class="size-10 rounded-lg object-cover" />
							{:else}
								<div class="size-10 rounded-lg bg-primary/10 flex items-center justify-center">
									<Building2 class="size-5 text-primary" />
								</div>
							{/if}

							<div class="space-y-1">
								<div class="flex items-center gap-2">
									<h4 class="font-medium">{org.name}</h4>
									{#if currentOrganization?.id === org.id}
										<Badge variant="secondary" class="text-xs">
											{localization.CURRENT || 'Current'}
										</Badge>
									{/if}
								</div>
								<div class="flex items-center gap-2 text-sm text-muted-foreground">
									<div class="flex items-center gap-1">
										<Users class="size-3" />
										{membersCount}
										{membersCount === 1
											? localization.MEMBER || 'member'
											: localization.MEMBERS || 'members'}
									</div>
								</div>
							</div>
						</div>

						<div class="flex items-center gap-2">
							{#if onManageOrganization}
								<Button
									size="sm"
									variant="ghost"
									onclick={(e) => {
										e.stopPropagation();
										onManageOrganization?.(org);
									}}
								>
									<Settings class="size-4" />
								</Button>
							{/if}
						</div>
					</button>
				{/each}
			</div>
		{/if}
	</Card.Content>

	<Card.Footer>
		{#if createOrganisationOpen}
			<div class="flex justify-end items-center w-full">
				<Button class="mr-2" variant="outline" onclick={() => (createOrganisationOpen = false)}>
					{$_('common.cancel')}
				</Button>
				{#if pending}
					<Button form="create-org-form" disabled>
						<LoaderCircle class="mr-2 size-4 animate-spin" />{$_('common.create')}
					</Button>
				{:else}
					<Button form="create-org-form" type="submit">{$_('common.create')}</Button>
				{/if}
			</div>
		{/if}
	</Card.Footer>
</Card.Root>
