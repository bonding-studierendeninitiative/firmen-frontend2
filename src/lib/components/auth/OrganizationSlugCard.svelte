<script lang="ts">
	import { cn } from '@/utils';
	import SettingsCard from './shared/SettingsCard.svelte';
	import { Input } from '@/components/ui/input';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Skeleton } from '@/components/ui/skeleton';
	import { Label } from '@/components/ui/label';
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
		activeOrganization?: { id: string; name: string; slug: string } | null;
		hasPermission?: boolean;
		isPending?: boolean;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		activeOrganization = { id: '1', name: 'Test Organization', slug: 'test-org' },
		hasPermission = true,
		isPending = false
	}: Props = $props();

	let slug = $state(activeOrganization?.slug || '');
	let isSubmitting = $state(false);
	let error = $state('');

	function validateSlug(value: string) {
		if (!value) {
			return localization.ORGANIZATION_SLUG_REQUIRED || 'Slug is required';
		}
		if (!/^[a-z0-9-]+$/.test(value)) {
			return (
				localization.ORGANIZATION_SLUG_INVALID ||
				'Slug can only contain lowercase letters, numbers, and hyphens'
			);
		}
		return '';
	}

	async function handleSubmit(event?: Event) {
		event?.preventDefault();
		if (!activeOrganization) return;

		const validationError = validateSlug(slug);
		if (validationError) {
			error = validationError;
			return;
		}

		isSubmitting = true;
		error = '';

		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success(localization.ORGANIZATION_SLUG_UPDATED || 'Organization slug updated');
		} catch (err) {
			toast.error(localization.UPDATE_FAILED || 'Failed to update organization slug');
		} finally {
			isSubmitting = false;
		}
	}

	// Validate on input change
	$effect(() => {
		if (slug !== activeOrganization?.slug) {
			error = validateSlug(slug);
		}
	});
</script>

{#if !activeOrganization}
	<SettingsCard
		{className}
		{classNames}
		title={localization.ORGANIZATION_SLUG || 'Organization Slug'}
		description={localization.ORGANIZATION_SLUG_DESCRIPTION ||
			'Update your organization URL identifier'}
		instructions={localization.ORGANIZATION_SLUG_INSTRUCTIONS ||
			'Choose a unique identifier for your organization URL'}
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
			title={localization.ORGANIZATION_SLUG || 'Organization Slug'}
			description={localization.ORGANIZATION_SLUG_DESCRIPTION ||
				'Update your organization URL identifier'}
			instructions={localization.ORGANIZATION_SLUG_INSTRUCTIONS ||
				'Choose a unique identifier for your organization URL'}
			actionLabel={localization.SAVE || 'Save'}
			action={handleSubmit}
			{isPending}
			disabled={!hasPermission || isSubmitting || !!error}
		>
			{#snippet children()}
				<Card.Content class={classNames?.content}>
					{#if isPending}
						<Skeleton class={cn('h-9 w-full', classNames?.skeleton)} />
					{:else}
						<div class="space-y-2">
							<Label for="slug">
								{localization.ORGANIZATION_SLUG || 'Organization Slug'}
							</Label>
							<Input
								id="slug"
								bind:value={slug}
								placeholder={localization.ORGANIZATION_SLUG_PLACEHOLDER || 'my-organization'}
								disabled={isSubmitting || !hasPermission}
								class={cn(classNames?.input, error && 'border-destructive')}
							/>
							{#if error}
								<p class={cn('text-sm text-destructive', classNames?.error)}>
									{error}
								</p>
							{/if}
							<p class="text-xs text-muted-foreground">
								{localization.ORGANIZATION_SLUG_HINT ||
									'This will be used in your organization URL'}
							</p>
						</div>
					{/if}
				</Card.Content>
			{/snippet}
		</SettingsCard>
	</form>
{/if}
