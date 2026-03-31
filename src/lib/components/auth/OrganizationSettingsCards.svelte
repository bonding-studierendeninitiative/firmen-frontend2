<script lang="ts">
	import { cn } from '@/utils';
	import OrganizationLogoCard from './OrganizationLogoCard.svelte';
	import OrganizationNameCard from './OrganizationNameCard.svelte';
	import OrganizationSlugCard from './OrganizationSlugCard.svelte';
	import DeleteOrganizationCard from '../organization/delete-organization-card.svelte';

	interface Props {
		className?: string;
		classNames?: {
			cards?: string;
			card?: any;
		};
		localization?: any;
		// Mock props - would come from context in real implementation
		activeOrganization?: { id: string; name: string; slug: string; logo?: string } | null;
		organizationConfig?: { logo?: boolean };
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		activeOrganization = { id: '1', name: 'Test Organization', slug: 'test-org', logo: '' },
		organizationConfig = { logo: true }
	}: Props = $props();
</script>

<div class={cn('flex w-full flex-col gap-4 md:gap-6', className, classNames?.cards)}>
	{#if organizationConfig?.logo}
		<OrganizationLogoCard classNames={classNames?.card} {localization} {activeOrganization} />
	{/if}

	<OrganizationNameCard classNames={classNames?.card} {localization} {activeOrganization} />

	<OrganizationSlugCard classNames={classNames?.card} {localization} {activeOrganization} />

	<DeleteOrganizationCard classNames={classNames?.card} {localization} {activeOrganization} />
</div>
