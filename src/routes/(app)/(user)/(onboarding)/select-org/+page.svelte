<script lang="ts">
	import { goto } from '$app/navigation';
	import authClient from '@/auth-client';
	import { CreateOrganizationDialog, OrganizationsCard } from '@/components/auth';
	import { Button } from '@/components/ui/button';
	import { fade } from 'svelte/transition';
	let org = authClient.useListOrganizations();
	let showCreateDialog = $state(false);
</script>

<CreateOrganizationDialog bind:open={showCreateDialog} />

<div in:fade>
	{#if $org.isPending}
		<p>Loading organizations...</p>
	{:else if $org.error}
		<p>Error loading organizations: {$org.error.message}</p>
	{:else}
		<OrganizationsCard
			organizations={$org.data ?? []}
			onSelectOrganization={(org) => {
				console.log('Selected organization:', org);
				authClient.organization.setActive({ organizationId: org.id });
				goto(`/${org.slug}/dashboard`);
			}}
			onCreateOrganization={() => (showCreateDialog = true)}
		/>
	{/if}
</div>
