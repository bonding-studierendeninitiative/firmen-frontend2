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

	let deleteDialogOpen = $state(false);
	let confirmationText = $state('');
	let isDeleting = $state(false);

	function handleDeleteClick() {
		deleteDialogOpen = true;
	}

	async function handleConfirmDelete() {
		if (!activeOrganization || confirmationText !== activeOrganization.name) {
			return;
		}

		isDeleting = true;

		try {
			await authClient.organization.delete({
				organizationId: activeOrganization.id
			});
			toast.success(localization.ORGANIZATION_DELETED || 'Organization deleted successfully');
			deleteDialogOpen = false;
			await goto('/select-org');
		} catch (error) {
			toast.error(localization.DELETE_FAILED || 'Failed to delete organization');
		} finally {
			isDeleting = false;
		}
	}

	let canDelete = $state(false);
	$effect(() => {
		canDelete = confirmationText === activeOrganization?.name && !isDeleting;
	});
</script>

<SettingsCard
	{className}
	{classNames}
	title={localization.DELETE_ORGANIZATION || 'Delete Organization'}
	description={localization.DELETE_ORGANIZATION_DESCRIPTION ||
		'Permanently delete this organization and all associated data'}
	instructions={localization.DELETE_ORGANIZATION_INSTRUCTIONS ||
		'This action cannot be undone. All data will be permanently removed.'}
	actionLabel={localization.DELETE_ORGANIZATION || 'Delete Organization'}
	action={handleDeleteClick}
	{isPending}
	disabled={!hasPermission}
/>

<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-destructive">
				<Trash2 class="size-5" />
				{localization.DELETE_ORGANIZATION || 'Delete Organization'}
			</Dialog.Title>
			<Dialog.Description>
				{localization.DELETE_ORGANIZATION_CONFIRM ||
					'This action cannot be undone. This will permanently delete the organization and all associated data.'}
			</Dialog.Description>
		</Dialog.Header>

		{#if activeOrganization}
			<div class="space-y-4">
				<div class="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
					<p class="text-sm font-medium text-destructive">
						{localization.DELETE_WARNING || 'Warning: This will delete everything'}
					</p>
					<ul class="mt-2 list-disc list-inside text-sm text-muted-foreground">
						<li>{localization.DELETE_WARNING_MEMBERS || 'All members will be removed'}</li>
						<li>{localization.DELETE_WARNING_DATA || 'All organization data will be lost'}</li>
						<li>{localization.DELETE_WARNING_IRREVERSIBLE || 'This action is irreversible'}</li>
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
				<Button variant="outline" onclick={() => (deleteDialogOpen = false)} disabled={isDeleting}>
					{localization.CANCEL || 'Cancel'}
				</Button>
				<Button
					variant="destructive"
					onclick={handleConfirmDelete}
					disabled={!canDelete}
					class={cn('gap-2', classNames?.destructiveButton)}
				>
					{#if isDeleting}
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
