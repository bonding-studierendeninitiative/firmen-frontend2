<script lang="ts">
	import { cn } from '@/utils';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Check, ChevronsUpDown, Building2, Plus, LoaderCircle } from '@lucide/svelte';
	import authClient from '@/auth-client';
	import CreateOrganizationDialog from '../auth/CreateOrganizationDialog.svelte';
	import { Button } from '@/components/ui/button';
	import { goto } from '$app/navigation';

	interface Organization {
		id: string;
		name: string;
		slug: string;
		logo?: string | null;
	}

	interface Props {
		className?: string;
		classNames?: {
			trigger?: string;
			content?: string;
			item?: string;
			separator?: string;
		};
		localization?: any;
		currentOrganization?: Organization;
		onSelect?: (org: Organization) => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		currentOrganization,
		onSelect
	}: Props = $props();

	// Filter organizations and personal account

	let session = authClient.useSession();
	let activeOrganization = authClient.useActiveOrganization();
	let organizations = authClient.useListOrganizations();

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((word) => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	function handleSelect(org: Organization) {
		authClient.organization.setActive({ organizationId: org.id });
		goto(`/${org.slug}/dashboard`);
		onSelect?.(org);
	}

	let isPending = $derived(
		$session.isPending || $activeOrganization.isPending || $organizations.isPending
	);

	let isError = $derived($session.error || $activeOrganization.error || $organizations.error);

	let open = $state(false);
</script>

<CreateOrganizationDialog bind:open />

{#if isPending}
	<div class="flex items-center justify-center p-4">
		<LoaderCircle class="size-6 animate-spin" />
	</div>
{:else if isError}
	<div class="text-red-500 p-4">
		{localization.ERROR_LOADING_ORGANIZATIONS || 'Error loading organizations'}
	</div>
{/if}

<DropdownMenu.Root>
	<DropdownMenu.Trigger>
		{#snippet child({ props })}
			<Button
				{...props}
				variant="outline"
				role="combobox"
				class={cn('w-full justify-between', className, classNames?.trigger)}
			>
				<div class="flex items-center gap-2 min-w-0 flex-1">
					{#if $activeOrganization.data?.id}
						{@const currentOrganization = $organizations.data?.find(
							(org) => org.id === $activeOrganization.data?.id
						)}
						{#if currentOrganization?.logo}
							<img
								src={currentOrganization.logo}
								alt={currentOrganization.name}
								class="size-5 rounded object-cover flex-shrink-0"
							/>
						{:else}
							<div
								class="size-5 rounded bg-primary/10 flex items-center justify-center flex-shrink-0"
							>
								<Building2 class="size-3 text-primary" />
							</div>
						{/if}
						<span class="truncate font-medium">
							{currentOrganization?.name}
						</span>
					{:else}
						<span class="text-muted-foreground">
							{localization.SELECT_ORGANIZATION || 'Select organization...'}
						</span>
					{/if}
				</div>
				<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</DropdownMenu.Trigger>

	<DropdownMenu.Content class={cn('w-56 p-0', classNames?.content)} align="start">
		<!-- Organizations -->
		{#if Number($organizations.data?.length) > 0}
			{#each $organizations.data ?? [] as org (org.id)}
				<DropdownMenu.Item
					onclick={() => handleSelect(org)}
					class={cn(
						'flex items-center gap-2 p-3',
						currentOrganization?.id === org.id && 'bg-accent',
						classNames?.item
					)}
				>
					<div class="flex items-center gap-2 flex-1 min-w-0">
						{#if org.logo}
							<img
								src={org.logo}
								alt={org.name}
								class="size-6 rounded object-cover flex-shrink-0"
							/>
						{:else}
							<div
								class="size-6 rounded bg-primary/10 flex items-center justify-center flex-shrink-0"
							>
								<Building2 class="size-3 text-primary" />
							</div>
						{/if}
						<div class="flex-1 min-w-0">
							<div class="font-medium truncate">{org.name}</div>
						</div>
					</div>
					{#if currentOrganization?.id === org.id}
						<Check class="size-4" />
					{/if}
				</DropdownMenu.Item>
			{/each}
		{/if}

		<!-- Create Organization -->
		{#if Number($organizations.data?.length) > 0}
			<DropdownMenu.Separator class={classNames?.separator} />
		{/if}
		<DropdownMenu.Item
			onclick={() => (open = true)}
			class={cn('flex items-center gap-2 p-3', classNames?.item)}
		>
			<div class="size-6 rounded bg-muted flex items-center justify-center flex-shrink-0">
				<Plus class="size-3" />
			</div>
			<span class="font-medium">
				{localization.CREATE_ORGANIZATION || 'Create organization'}
			</span>
		</DropdownMenu.Item>
	</DropdownMenu.Content>
</DropdownMenu.Root>
