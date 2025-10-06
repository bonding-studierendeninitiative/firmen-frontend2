<script lang="ts">
	import { cn } from '@/utils';
	import SettingsCard from './shared/SettingsCard.svelte';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Badge } from '@/components/ui/badge';
	import OrganizationLogo from './OrganizationLogo.svelte';
	import { Calendar, Mail, X } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Invitation {
		id: string;
		email: string;
		role: string;
		organizationId: string;
		organizationName: string;
		organizationSlug?: string;
		organizationLogo?: string;
		createdAt: string;
		expiresAt: string;
		status: 'pending' | 'accepted' | 'rejected';
	}

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			content?: string;
			cell?: string;
			button?: string;
		};
		localization?: any;
		// Mock data - would come from context in real implementation
		invitations?: Invitation[];
		isPending?: boolean;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		invitations = [
			{
				id: '1',
				email: 'john.doe@example.com',
				role: 'member',
				organizationId: '1',
				organizationName: 'Test Organization',
				organizationSlug: 'test-org',
				createdAt: new Date().toISOString(),
				expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
				status: 'pending'
			}
		],
		isPending = false
	}: Props = $props();

	async function revokeInvitation(invitationId: string) {
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			// Remove from local list
			invitations = invitations.filter((inv) => inv.id !== invitationId);

			toast.success(localization.INVITATION_REVOKED || 'Invitation revoked');
		} catch (error) {
			toast.error(localization.REVOKE_FAILED || 'Failed to revoke invitation');
		}
	}

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString();
	}

	function getRoleLabel(role: string) {
		const roleLabels = {
			owner: localization.OWNER || 'Owner',
			admin: localization.ADMIN || 'Admin',
			member: localization.MEMBER || 'Member'
		};
		return roleLabels[role as keyof typeof roleLabels] || role;
	}

	function getStatusColor(status: string) {
		switch (status) {
			case 'pending':
				return 'bg-yellow-100 text-yellow-800';
			case 'accepted':
				return 'bg-green-100 text-green-800';
			case 'rejected':
				return 'bg-red-100 text-red-800';
			default:
				return 'bg-gray-100 text-gray-800';
		}
	}
</script>

<SettingsCard
	{className}
	{classNames}
	title={localization.ORGANIZATION_INVITATIONS || 'Pending Invitations'}
	description={localization.ORGANIZATION_INVITATIONS_DESCRIPTION ||
		'Manage pending organization invitations'}
	instructions={localization.ORGANIZATION_INVITATIONS_INSTRUCTIONS ||
		'View and manage invitations sent to join your organization'}
	{isPending}
>
	{#snippet children()}
		{#if !isPending && invitations.length > 0}
			<Card.Content class={cn('grid gap-4', classNames?.content)}>
				{#each invitations as invitation (invitation.id)}
					<Card.Root class={cn('flex-row items-center p-4', classNames?.cell)}>
						<div class="flex min-w-0 flex-1 items-center gap-3">
							<div class="flex size-8 items-center justify-center rounded-full bg-muted">
								<Mail class="size-4 text-muted-foreground" />
							</div>

							<div class="min-w-0 flex-1">
								<div class="flex items-center gap-2">
									<p class="font-medium text-sm truncate">
										{invitation.email}
									</p>
									<Badge variant="secondary" class="text-xs">
										{getRoleLabel(invitation.role)}
									</Badge>
									<Badge class={cn('text-xs', getStatusColor(invitation.status))}>
										{invitation.status}
									</Badge>
								</div>
								<div class="flex items-center gap-4 text-xs text-muted-foreground">
									<span class="flex items-center gap-1">
										<Calendar class="size-3" />
										{localization.INVITED || 'Invited'}
										{formatDate(invitation.createdAt)}
									</span>
									<span>
										{localization.EXPIRES || 'Expires'}
										{formatDate(invitation.expiresAt)}
									</span>
								</div>
							</div>
						</div>

						{#if invitation.status === 'pending'}
							<Button
								variant="outline"
								size="sm"
								onclick={() => revokeInvitation(invitation.id)}
								class={cn('ml-auto gap-1', classNames?.button)}
							>
								<X class="size-3" />
								{localization.REVOKE || 'Revoke'}
							</Button>
						{/if}
					</Card.Root>
				{/each}
			</Card.Content>
		{:else if !isPending}
			<Card.Content class={classNames?.content}>
				<div class="text-center py-6">
					<Mail class="mx-auto size-12 text-muted-foreground/50" />
					<p class="mt-2 text-sm text-muted-foreground">
						{localization.NO_PENDING_INVITATIONS || 'No pending invitations'}
					</p>
				</div>
			</Card.Content>
		{/if}
	{/snippet}
</SettingsCard>
