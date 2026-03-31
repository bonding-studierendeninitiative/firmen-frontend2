<script lang="ts">
	import { cn } from '@/utils';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Skeleton } from '@/components/ui/skeleton';
	import OrganizationLogo from './OrganizationLogo.svelte';
	import { CheckIcon, XIcon, Loader2 } from '@lucide/svelte';
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
	}

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			header?: string;
			title?: string;
			description?: string;
			content?: string;
			skeleton?: string;
		};
		localization?: any;
		// Would come from URL params in real implementation
		invitationId?: string;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		invitationId = 'mock-invitation-id'
	}: Props = $props();

	// Mock invitation data - would come from API in real implementation
	let invitation = $state<Invitation | null>({
		id: invitationId,
		email: 'user@example.com',
		role: 'member',
		organizationId: '1',
		organizationName: 'Test Organization',
		organizationSlug: 'test-org',
		createdAt: new Date().toISOString(),
		expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
	});

	let isPending = $state(false);
	let isAccepting = $state(false);
	let isRejecting = $state(false);

	let isProcessing = $derived(isAccepting || isRejecting);

	async function handleAccept() {
		if (!invitation) return;

		isAccepting = true;
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 2000));
			toast.success(
				localization.INVITATION_ACCEPTED || 'Invitation accepted! Welcome to the organization.'
			);
			// Would redirect to organization in real implementation
		} catch (error) {
			toast.error(localization.ACCEPT_FAILED || 'Failed to accept invitation');
		} finally {
			isAccepting = false;
		}
	}

	async function handleReject() {
		if (!invitation) return;

		isRejecting = true;
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success(localization.INVITATION_REJECTED || 'Invitation declined');
			// Would redirect away in real implementation
		} catch (error) {
			toast.error(localization.REJECT_FAILED || 'Failed to decline invitation');
		} finally {
			isRejecting = false;
		}
	}

	function getRoleLabel(role: string) {
		const roleLabels = {
			owner: localization.OWNER || 'Owner',
			admin: localization.ADMIN || 'Admin',
			member: localization.MEMBER || 'Member'
		};
		return roleLabels[role as keyof typeof roleLabels] || role;
	}
</script>

{#if isPending}
	<!-- Loading skeleton -->
	<Card.Root class={cn('w-full max-w-sm', className, classNames?.base)}>
		<Card.Header class={cn('justify-items-center text-center', classNames?.header)}>
			<Skeleton class={cn('my-1 h-5 w-full max-w-32 md:h-5.5 md:w-40', classNames?.skeleton)} />
			<Skeleton class={cn('my-0.5 h-3 w-full max-w-56 md:h-3.5 md:w-64', classNames?.skeleton)} />
		</Card.Header>

		<Card.Content class={cn('flex flex-col gap-6 truncate', classNames?.content)}>
			<Card.Root class="flex-row items-center p-4">
				<Skeleton class="size-8 rounded-full" />
				<div class="ml-3 flex-1 space-y-1">
					<Skeleton class="h-4 w-3/4" />
					<Skeleton class="h-3 w-1/2" />
				</div>
				<Skeleton class="ml-auto h-4 w-14" />
			</Card.Root>

			<div class="grid grid-cols-2 gap-3">
				<Skeleton class="h-9 w-full" />
				<Skeleton class="h-9 w-full" />
			</div>
		</Card.Content>
	</Card.Root>
{:else if invitation}
	<Card.Root class={cn('w-full max-w-sm', className, classNames?.base)}>
		<Card.Header class={cn('justify-items-center text-center', classNames?.header)}>
			<Card.Title class={cn('text-lg md:text-xl', classNames?.title)}>
				{localization.ACCEPT_INVITATION || 'Accept Invitation'}
			</Card.Title>
			<Card.Description class={cn('text-xs md:text-sm', classNames?.description)}>
				{localization.ACCEPT_INVITATION_DESCRIPTION ||
					"You've been invited to join an organization"}
			</Card.Description>
		</Card.Header>

		<Card.Content class={cn('flex flex-col gap-6 truncate', classNames?.content)}>
			<!-- Organization info -->
			<Card.Root class="flex-row items-center p-4">
				<OrganizationLogo
					organization={{
						id: invitation.organizationId,
						name: invitation.organizationName,
						slug: invitation.organizationSlug,
						logo: invitation.organizationLogo
					}}
					size="default"
					{localization}
				/>

				<div class="ml-3 min-w-0 flex-1">
					<p class="font-medium text-sm truncate">
						{invitation.organizationName}
					</p>
					{#if invitation.organizationSlug}
						<p class="text-muted-foreground text-xs truncate">
							/{invitation.organizationSlug}
						</p>
					{/if}
				</div>

				<div class="ml-auto text-right">
					<p class="text-muted-foreground text-xs">
						{localization.ROLE || 'Role'}
					</p>
					<p class="font-medium text-sm">
						{getRoleLabel(invitation.role)}
					</p>
				</div>
			</Card.Root>

			<!-- Action buttons -->
			<div class="grid grid-cols-2 gap-3">
				<Button variant="outline" onclick={handleReject} disabled={isProcessing} class="gap-2">
					{#if isRejecting}
						<Loader2 class="size-4 animate-spin" />
					{:else}
						<XIcon class="size-4" />
					{/if}
					{localization.REJECT || 'Decline'}
				</Button>

				<Button onclick={handleAccept} disabled={isProcessing} class="gap-2">
					{#if isAccepting}
						<Loader2 class="size-4 animate-spin" />
					{:else}
						<CheckIcon class="size-4" />
					{/if}
					{localization.ACCEPT || 'Accept'}
				</Button>
			</div>
		</Card.Content>
	</Card.Root>
{:else}
	<!-- Error state -->
	<Card.Root class={cn('w-full max-w-sm', className, classNames?.base)}>
		<Card.Header class="text-center">
			<Card.Title class="text-destructive">
				{localization.INVITATION_NOT_FOUND || 'Invitation Not Found'}
			</Card.Title>
			<Card.Description>
				{localization.INVITATION_EXPIRED || 'This invitation may have expired or been revoked'}
			</Card.Description>
		</Card.Header>
	</Card.Root>
{/if}
