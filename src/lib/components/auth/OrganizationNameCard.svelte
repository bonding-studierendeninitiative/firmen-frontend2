<script lang="ts">
	import { cn } from '@/utils';
	import SettingsCard from './shared/SettingsCard.svelte';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Skeleton } from '@/components/ui/skeleton';
	import { Field, Control, FieldErrors, Label } from '@/components/ui/form';
	import { superForm, type SuperValidated, type Infer } from 'sveltekit-superforms';
	import { valibot } from 'sveltekit-superforms/adapters';
	import * as v from 'valibot';
	import { toast } from 'svelte-sonner';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			content?: string;
			skeleton?: string;
			input?: string;
			error?: string;
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

	// Create validation schema
	const formSchema = v.object({
		name: v.pipe(
			v.string(),
			v.minLength(1, localization.ORGANIZATION_NAME_REQUIRED || 'Organization name is required')
		)
	});

	// Create mock form data
	const mockForm = {
		valid: true,
		posted: false,
		errors: {},
		data: { name: activeOrganization?.name || '' },
		constraints: { name: { required: true } }
	} as any;

	let isSubmitting = $state(false);

	async function handleSubmit(event?: Event) {
		event?.preventDefault();
		if (!activeOrganization) return;

		isSubmitting = true;
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success(localization.ORGANIZATION_NAME_UPDATED || 'Organization name updated');
		} catch (error) {
			toast.error(localization.UPDATE_FAILED || 'Failed to update organization name');
		} finally {
			isSubmitting = false;
		}
	}
</script>

{#if !activeOrganization}
	<SettingsCard
		{className}
		{classNames}
		title={localization.ORGANIZATION_NAME || 'Organization Name'}
		description={localization.ORGANIZATION_NAME_DESCRIPTION ||
			'Update your organization display name'}
		instructions={localization.ORGANIZATION_NAME_INSTRUCTIONS ||
			'Choose a name that represents your organization'}
		actionLabel={localization.SAVE || 'Save'}
		{isPending}
	>
		{#snippet children()}
			<Card.Content class={classNames?.content}>
				<Skeleton class={cn('h-9 w-full', classNames?.skeleton)} />
			</Card.Content>
		{/snippet}
	</SettingsCard>
{:else}
	<form onsubmit={handleSubmit}>
		<SettingsCard
			{className}
			{classNames}
			title={localization.ORGANIZATION_NAME || 'Organization Name'}
			description={localization.ORGANIZATION_NAME_DESCRIPTION ||
				'Update your organization display name'}
			instructions={localization.ORGANIZATION_NAME_INSTRUCTIONS ||
				'Choose a name that represents your organization'}
			actionLabel={localization.SAVE || 'Save'}
			action={handleSubmit}
			{isPending}
			disabled={!hasPermission || isSubmitting}
		>
			{#snippet children()}
				<Card.Content class={classNames?.content}>
					{#if isPending}
						<Skeleton class={cn('h-9 w-full', classNames?.skeleton)} />
					{:else}
						<div class="space-y-2">
							<Label for="name">
								{localization.ORGANIZATION_NAME || 'Organization Name'}
							</Label>
							<Input
								id="name"
								bind:value={mockForm.data.name}
								placeholder={localization.ORGANIZATION_NAME_PLACEHOLDER ||
									'Enter organization name'}
								disabled={isSubmitting || !hasPermission}
								class={classNames?.input}
							/>
							{#if mockForm.errors?.name}
								<p class={cn('text-sm text-destructive', classNames?.error)}>
									{mockForm.errors.name}
								</p>
							{/if}
						</div>
					{/if}
				</Card.Content>
			{/snippet}
		</SettingsCard>
	</form>
{/if}
