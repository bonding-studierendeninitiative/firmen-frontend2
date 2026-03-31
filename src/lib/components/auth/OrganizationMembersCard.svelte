<script lang="ts">
	import { cn } from '@/utils';
	import SettingsCard from './shared/SettingsCard.svelte';
	import MemberCell from './MemberCell.svelte';
	import * as Card from '@/components/ui/card';
	import { Skeleton } from '@/components/ui/skeleton';

	interface Member {
		id: string;
		role: string;
		createdAt: string;
		user: {
			id: string;
			name?: string;
			email?: string;
			image?: string;
		};
	}

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			content?: string;
			cell?: string;
			button?: string;
			icon?: string;
			skeleton?: string;
		};
		localization?: any;
		// Mock data - would come from context in real implementation
		members?: Member[];
		isPending?: boolean;
		hasPermissionInvite?: boolean;
		hasPermissionUpdateMember?: boolean;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		members = [],
		isPending = false,
		hasPermissionInvite = true,
		hasPermissionUpdateMember = true
	}: Props = $props();

	let inviteDialogOpen = $state(false);

	// Mock active organization check - would come from context
	let activeOrganization = { id: '1', name: 'Test Org' };

	function handleInviteClick() {
		inviteDialogOpen = true;
	}

	let sortedMembers = $derived(
		members.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
	);
</script>

{#if !activeOrganization}
	<SettingsCard
		{className}
		{classNames}
		title={localization.MEMBERS || 'Members'}
		description={localization.MEMBERS_DESCRIPTION || 'Manage organization members and their roles'}
		instructions={localization.MEMBERS_INSTRUCTIONS || 'Add, remove, and update member roles'}
		actionLabel={localization.INVITE_MEMBER || 'Invite Member'}
		{isPending}
	/>
{:else}
	<SettingsCard
		{className}
		{classNames}
		title={localization.MEMBERS || 'Members'}
		description={localization.MEMBERS_DESCRIPTION || 'Manage organization members and their roles'}
		instructions={localization.MEMBERS_INSTRUCTIONS || 'Add, remove, and update member roles'}
		actionLabel={localization.INVITE_MEMBER || 'Invite Member'}
		action={handleInviteClick}
		{isPending}
		disabled={!hasPermissionInvite}
	>
		{#snippet children()}
			{#if !isPending && sortedMembers.length > 0}
				<Card.Content class={cn('grid gap-4', classNames?.content)}>
					{#each sortedMembers as member (member.id)}
						<MemberCell
							{classNames}
							{member}
							{localization}
							hideActions={!hasPermissionUpdateMember}
						/>
					{/each}
				</Card.Content>
			{/if}
		{/snippet}
	</SettingsCard>

	<!-- TODO: Implement InviteMemberDialog -->
	{#if inviteDialogOpen}
		<!-- InviteMemberDialog would go here -->
	{/if}
{/if}
