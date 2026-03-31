<script lang="ts">
	import { _ } from '@services';
	import { cn } from '@/utils';
	import SettingsCard from '../auth/shared/SettingsCard.svelte';
	import * as Dialog from '@/components/ui/dialog';
	import * as Field from '@/components/ui/field';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
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
		// Mock props - would come from context in real implementation
		activeOrganization?: { id: string; name: string } | null;
		hasPermission?: boolean;
		isPending?: boolean;
	}

	let {
		className = '',
		classNames = {},
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
			toast.success($_('components.auth.organization.delete.deleted-successfully'));
			deleteDialogOpen = false;
			await goto('/select-org');
		} catch (error) {
			toast.error($_('components.auth.organization.delete.delete-failed'));
		} finally {
			isDeleting = false;
		}
	}

	let canDelete = $state(false);
	$effect(() => {
		canDelete = confirmationText === activeOrganization?.name && !isDeleting;
	});
</script>

{#snippet actionLabel()}
	<Trash2 />
	<p>{$_('common.delete')}</p>
{/snippet}

<SettingsCard
	{className}
	{classNames}
	title={$_('components.auth.organization.delete.title')}
	description={$_('components.auth.organization.delete.description')}
	instructions={$_('components.auth.organization.delete.instructions')}
	action={{
		fn: handleDeleteClick,
		label: actionLabel,
		variant: 'destructive'
	}}
	{isPending}
	disabled={!hasPermission}
/>

<Dialog.Root bind:open={deleteDialogOpen}>
	<Dialog.Content class="max-w-md">
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2 text-destructive">
				<Trash2 class="size-5" />
				{$_('components.auth.organization.delete.title')}
			</Dialog.Title>
			<Dialog.Description>
				{$_('components.auth.organization.delete.description')}
			</Dialog.Description>
		</Dialog.Header>

		{#if activeOrganization}
			<div class="space-y-4">
				<div class="rounded-lg border border-destructive/20 bg-destructive/5 p-4">
					<p class="text-sm font-medium text-destructive">
						{$_('components.auth.organization.delete.warning.label')}
					</p>
					<ul class="mt-2 list-disc list-inside text-sm text-muted-foreground">
						<li>{$_('components.auth.organization.delete.warning.members')}</li>
						<li>
							{$_('components.auth.organization.delete.warning.data')}
						</li>
						<li>
							{$_('components.auth.organization.delete.warning.irreversible')}
						</li>
					</ul>
				</div>

				<Field.Field class="space-y-2">
					<Field.Content>
						<Field.Label for="confirm-name">
							{$_('components.auth.organization.delete.type-name', {
								values: {
									orgName: activeOrganization.name
								}
							})}
						</Field.Label>
						<Input
							id="confirm-name"
							bind:value={confirmationText}
							placeholder={activeOrganization.name}
							class={cn(
								'transition-colors',
								confirmationText === activeOrganization.name ? 'border-destructive' : ''
							)}
						/>
					</Field.Content>
				</Field.Field>
			</div>

			<Dialog.Footer class="gap-2">
				<Dialog.Close onclick={() => (deleteDialogOpen = false)} disabled={isDeleting}>
					{$_('common.cancel')}
				</Dialog.Close>
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
					{$_('common.delete')}
				</Button>
			</Dialog.Footer>
		{/if}
	</Dialog.Content>
</Dialog.Root>
