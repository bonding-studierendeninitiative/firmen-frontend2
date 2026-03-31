<script lang="ts">
	import { goto } from '$app/navigation';
	import authClient from '@/auth-client';
	import { CreateOrganizationDialog, OrganizationsCard } from '@/components/auth';
	import { Button } from '@/components/ui/button';
	import { fade } from 'svelte/transition';
	import { getUserMemberships } from '@/remote/functions/organizations.remote.js';

	let orgs = getUserMemberships({})
	console.log(orgs.current)
	// let showCreateDialog = $state(false);
</script>

<!-- <CreateOrganizationDialog bind:open={showCreateDialog} /> -->

<div in:fade>
	{#if orgs.loading}
		<p>Loading organizations...</p>
	{:else if orgs.error}
		<p>Error loading organizations: {orgs.error}</p>
	{:else}
		<OrganizationsCard
			organizations={orgs.current ?? []}
			onSelectOrganization={async (org) => {
				console.log('Selected organization:', org);
				await authClient.organization.setActive({ organizationId: org.id });
				await goto(`/${org.slug}/dashboard`);
			}}
		/>
	{/if}
</div>
