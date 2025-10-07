<script lang="ts">
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Badge } from '@/components/ui/badge';
	import { Users, Plus, Building2, Settings } from '@lucide/svelte';
	import {createOrganization} from "@/remote/functions"
	
	let createOrganisationOpen  = $state(false);

	interface Organization {
		id: string;
		name: string;
		slug: string;
		logo?: string | null | undefined | undefined;
		metadata?: any;
	}

	interface Props {
		localization?: any;
		organizations?: Organization[];
		currentOrganization?: Organization;
		onCreateOrganization?: () => void;
		onSelectOrganization?: (org: Organization) => void;
		onManageOrganization?: (org: Organization) => void;
	}

	let {
		localization = {},
		organizations = [],
		currentOrganization,
		onCreateOrganization,
		onSelectOrganization,
		onManageOrganization
	}: Props = $props();

	// Filter out personal account from organizations list
	let orgList = $derived(organizations.filter((org) => !org.isPersonal));
</script>

<Card.Root class='w-full'>
	<Card.Header>
		<div class="flex items-center justify-between">
			<div class="space-y-1">
				<Card.Title class="flex items-center gap-2">
					<Building2 class="size-5" />
					{localization.ORGANIZATIONS || 'Organizations'}
				</Card.Title>
				<Card.Description>
					{localization.ORGANIZATIONS_DESCRIPTION || 'Manage your organizations and teams'}
				</Card.Description>
			</div>
			{#if onCreateOrganization && orgList.length > 0}
				<Button size="sm" onclick={onCreateOrganization}>
					<Plus class="mr-2 size-4" />
					{localization.CREATE_ORGANIZATION || 'Create'}
				</Button>
			{/if}
		</div>
	</Card.Header>

	<Card.Content class='space-y-4 h-80 w-120'>
		{#if createOrganisationOpen}
			<form {...createOrganization.enhance(async () => {})}></form>
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
						{localization.NO_ORGANIZATIONS || 'No organizations yet'}
					</h3>
					<p class="text-sm text-muted-foreground max-w-sm mx-auto">
						{localization.NO_ORGANIZATIONS_DESCRIPTION ||
							'Create your first organization to collaborate with your team'}
					</p>
				</div>
				{#if onCreateOrganization}
					<Button onclick={() => createOrganisationOpen = true}>
						<Plus class="mr-2 size-4" />
						{localization.CREATE_FIRST_ORGANIZATION || 'Create your first organization'}
					</Button>
				{/if}
			</div>
		{:else}
			<!-- Organizations list -->
			<div class="space-y-3">
				{#each orgList as org (org.id)}
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
									<Badge variant="outline" class="text-xs">
										{org.role}
									</Badge>
									<div class="flex items-center gap-1">
										<Users class="size-3" />
										{org.membersCount}
										{org.membersCount === 1
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
</Card.Root>
