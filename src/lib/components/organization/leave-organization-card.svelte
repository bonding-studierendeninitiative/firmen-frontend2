<script lang="ts">
	import { cn } from '@/utils';
	import SettingsCard from '../auth/shared/SettingsCard.svelte';
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { toast } from 'svelte-sonner';
	import { Trash2 } from '@lucide/svelte';
	import authClient from '@/auth-client';
	import { goto } from '$app/navigation';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			button?: string;
			destructiveButton?: string;
		};
		localization?: any;
		// Mock props - would come from context in real implementation
		activeOrganization?: { id: string; name: string } | null;
		hasPermission?: boolean;
		isPending?: boolean;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		activeOrganization = { id: '1', name: 'Test Organization' },
		hasPermission = true,
		isPending = false
	}: Props = $props();

	let leaveDialogOpen = $state(false);
	let confirmationText = $state('');
	let isLeaving = $state(false);

	function handleLeaveClick() {
		leaveDialogOpen = true;
	}

	async function handleConfirmLeave() {
		if (!activeOrganization || confirmationText !== activeOrganization.name) {
			return;
		}

		isLeaving = true;

		try {
			await authClient.organization.leave({
				organizationId: activeOrganization.id
			});
			toast.success(localization.ORGANIZATION_LEFT || 'Organization left successfully');
			leaveDialogOpen = false;
			await goto('/select-org');
		} catch (error) {
			toast.error(localization.LEAVE_FAILED || 'Failed to leave organization');
		} finally {
			isLeaving = false;
		}
	}

	let canLeave = $state(false);
	$effect(() => {
		canLeave = confirmationText === activeOrganization?.name && !isLeaving;
	});
</script>

<SettingsCard
	{className}
	{classNames}
	title={localization.LEAVE_ORGANIZATION || 'Leave Organization'}
	description={localization.LEAVE_ORGANIZATION_DESCRIPTION ||
		'Permanently leave this organization and all associated data'}
	instructions={localization.LEAVE_ORGANIZATION_INSTRUCTIONS ||
		'This action cannot be undone. All data will be permanently removed.'}
	actionLabel={localization.LEAVE_ORGANIZATION || 'Leave Organization'}
	action={handleLeaveClick}
	{isPending}
	disabled={!hasPermission}
/>

<Dialog.Root bind:open={leaveDialogOpen}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-destructive">
				<Trash2 class="size-5" />
				{localization.LEAVE_ORGANIZATION || 'Leave Organization'}
			</Dialog.Title>
			<Dialog.Description>
				{localization.LEAVE_ORGANIZATION_CONFIRM ||
					'This action cannot be undone. This will permanently delete the organization and all associated data.'}
			</Dialog.Description>
		</Dialog.Header>

		{#if activeOrganization}
			<div class="space-y-4">
				<div class="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
					<p class="text-sm font-medium text-destructive">
						{localization.LEAVE_WARNING || 'Warning: This will leave the organization'}
					</p>
					<ul class="mt-2 list-disc list-inside text-sm text-muted-foreground">
						<li>{localization.LEAVE_WARNING_MEMBERS || 'All members will be removed'}</li>
						<li>{localization.LEAVE_WARNING_DATA || 'All organization data will be lost'}</li>
						<li>{localization.LEAVE_WARNING_IRREVERSIBLE || 'This action is irreversible'}</li>
					</ul>
				</div>

				<div class="space-y-2">
					<Label for="confirm-name">
						{localization.TYPE_ORGANIZATION_NAME || `Type "${activeOrganization.name}" to confirm`}
					</Label>
					<Input
						id="confirm-name"
						bind:value={confirmationText}
						placeholder={activeOrganization.name}
						class={cn(
							'transition-colors',
							confirmationText === activeOrganization.name ? 'border-destructive' : ''
						)}
					/>
				</div>
			</div>

			<Dialog.Footer class="gap-2">
				<Button variant="outline" onclick={() => (leaveDialogOpen = false)} disabled={isLeaving}>
					{localization.CANCEL || 'Cancel'}
				</Button>
				<Button
					variant="destructive"
					onclick={handleConfirmLeave}
					disabled={!canLeave || isLeaving}
					class={cn('gap-2', classNames?.destructiveButton)}
				>
					{#if isLeaving}
						<div
							class="size-4 animate-spin rounded-full border-2 border-current border-t-transparent"
						></div>
					{:else}
						<Trash2 class="size-4" />
					{/if}
					{localization.DELETE_ORGANIZATION || 'Delete Organization'}
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
