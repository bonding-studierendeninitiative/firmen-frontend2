<script lang="ts">
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import * as Dialog from '@/components/ui/dialog';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { AlertTriangle, Loader2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Organization {
		id: string;
		name: string;
		slug: string;
		role: string;
	}

	interface Props {
		className?: string;
		classNames?: {
			content?: string;
			form?: string;
			input?: string;
			button?: string;
			cancelButton?: string;
		};
		localization?: any;
		organization: Organization;
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		onLeave?: (orgId: string) => Promise<void>;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		organization,
		open = false,
		onOpenChange,
		onLeave
	}: Props = $props();

	let confirmationText = $state('');
	let isLoading = $state(false);

	let canConfirm = $derived(confirmationText === organization.name);

	async function handleLeave() {
		if (!canConfirm) return;

		isLoading = true;

		try {
			await onLeave?.(organization.id);
			toast.success(
				localization.LEAVE_ORGANIZATION_SUCCESS || `Left ${organization.name} successfully`
			);
			onOpenChange?.(false);
		} catch (error) {
			toast.error(localization.LEAVE_ORGANIZATION_ERROR || 'Failed to leave organization');
		} finally {
			isLoading = false;
		}
	}

	function handleCancel() {
		confirmationText = '';
		onOpenChange?.(false);
	}
</script>

<Dialog.Root {open} {onOpenChange}>
	<Dialog.Content class={cn('sm:max-w-md', className, classNames?.content)}>
		<Dialog.Header>
			<Dialog.Title class="flex items-center gap-2">
				<AlertTriangle class="size-5 text-destructive" />
				{localization.LEAVE_ORGANIZATION_TITLE || 'Leave Organization'}
			</Dialog.Title>
			<Dialog.Description>
				{localization.LEAVE_ORGANIZATION_DESCRIPTION ||
					`Are you sure you want to leave "${organization.name}"? This action cannot be undone.`}
			</Dialog.Description>
		</Dialog.Header>

		<div class={cn('space-y-4', classNames?.form)}>
			<div class="space-y-2">
				<Label for="confirmation" class="text-sm font-medium">
					{localization.CONFIRMATION_LABEL || `Type "${organization.name}" to confirm:`}
				</Label>
				<Input
					id="confirmation"
					bind:value={confirmationText}
					placeholder={organization.name}
					disabled={isLoading}
					class={classNames?.input}
				/>
			</div>

			<div class="space-y-2 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
				<h4 class="font-medium text-destructive text-sm">
					{localization.WARNING_TITLE || 'Warning'}
				</h4>
				<ul class="text-sm text-destructive/80 space-y-1">
					<li>
						• {localization.WARNING_ACCESS || 'You will lose access to all organization resources'}
					</li>
					<li>
						• {localization.WARNING_DATA ||
							'Any data associated with your membership will be removed'}
					</li>
					<li>• {localization.WARNING_INVITE || 'You will need to be re-invited to rejoin'}</li>
				</ul>
			</div>
		</div>

		<Dialog.Footer class="flex flex-col-reverse sm:flex-row gap-2">
			<Button
				variant="outline"
				onclick={handleCancel}
				disabled={isLoading}
				class={cn('sm:w-auto w-full', classNames?.cancelButton)}
			>
				{localization.CANCEL || 'Cancel'}
			</Button>
			<Button
				variant="destructive"
				onclick={handleLeave}
				disabled={!canConfirm || isLoading}
				class={cn('sm:w-auto w-full', classNames?.button)}
			>
				{#if isLoading}
					<Loader2 class="mr-2 size-4 animate-spin" />
				{/if}
				{localization.LEAVE_ORGANIZATION || 'Leave Organization'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
