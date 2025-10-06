<script lang="ts">
	import { cn } from '@/utils';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Skeleton } from '@/components/ui/skeleton';
	import { Loader2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface User {
		id: string;
		name: string;
		email: string;
	}

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			header?: string;
			title?: string;
			description?: string;
			content?: string;
			label?: string;
			input?: string;
			button?: string;
			skeleton?: string;
		};
		localization?: any;
		user?: User | null;
		onSuccess?: (user: User) => void;
		onError?: (error: Error) => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		user = null,
		onSuccess,
		onError
	}: Props = $props();

	let isPending = $state(false);
	let isUpdating = $state(false);
	let name = $state('');
	let errors = $state<{ name?: string }>({});
	let displayUser: User | null = $state(null);

	$effect(() => {
		displayUser = user || {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com'
		};
	});

	let isProcessing = $derived(isUpdating);

	let hasChanges = $derived(name !== displayUser?.name);

	function validateForm() {
		const newErrors: { name?: string } = {};

		if (!name.trim()) {
			newErrors.name = localization.NAME_REQUIRED || 'Name is required';
		} else if (name.trim().length < 2) {
			newErrors.name = localization.NAME_TOO_SHORT || 'Name must be at least 2 characters';
		} else if (name.trim().length > 50) {
			newErrors.name = localization.NAME_TOO_LONG || 'Name must be less than 50 characters';
		}

		errors = newErrors;
		return Object.keys(newErrors).length === 0;
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!validateForm()) {
			return;
		}

		isUpdating = true;
		try {
			// Mock API call
			await new Promise((resolve) => setTimeout(resolve, 1000));

			const updatedUser = { ...displayUser, name: name.trim() };
			toast.success(localization.NAME_UPDATED || 'Name updated successfully!');
			onSuccess?.(updatedUser);
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : 'Failed to update name';
			toast.error(localization.UPDATE_ERROR || errorMessage);
			onError?.(error instanceof Error ? error : new Error(errorMessage));
		} finally {
			isUpdating = false;
		}
	}

	function handleInput() {
		// Clear errors on input
		if (errors.name) {
			errors = { ...errors, name: undefined };
		}
	}
</script>

{#if isPending}
	<!-- Loading skeleton -->
	<Card.Root class={cn('w-full max-w-sm', className, classNames?.base)}>
		<Card.Header class={cn('text-center', classNames?.header)}>
			<Skeleton class={cn('mx-auto h-5 w-32 md:h-5.5 md:w-40', classNames?.skeleton)} />
			<Skeleton class={cn('h-3 w-full max-w-56 md:h-3.5 md:w-64', classNames?.skeleton)} />
		</Card.Header>

		<Card.Content class={cn('space-y-4', classNames?.content)}>
			<div class="space-y-2">
				<Skeleton class={cn('h-4 w-16', classNames?.skeleton)} />
				<Skeleton class={cn('h-10 w-full', classNames?.skeleton)} />
			</div>
			<Skeleton class={cn('h-10 w-full', classNames?.skeleton)} />
		</Card.Content>
	</Card.Root>
{:else}
	<Card.Root class={cn('w-full max-w-sm', className, classNames?.base)}>
		<Card.Header class={cn('text-center', classNames?.header)}>
			<Card.Title class={cn('text-lg md:text-xl', classNames?.title)}>
				{localization.UPDATE_NAME || 'Update Name'}
			</Card.Title>
			<Card.Description class={cn('text-xs md:text-sm', classNames?.description)}>
				{localization.UPDATE_NAME_DESCRIPTION || 'Change your display name'}
			</Card.Description>
		</Card.Header>

		<Card.Content class={classNames?.content}>
			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-2">
					<Label for="name" class={classNames?.label}>
						{localization.NAME || 'Name'}
					</Label>
					<Input
						id="name"
						type="text"
						bind:value={name}
						oninput={handleInput}
						placeholder={localization.NAME_PLACEHOLDER || 'Enter your name'}
						disabled={isProcessing}
						class={cn(
							errors.name && 'border-destructive focus-visible:ring-destructive',
							classNames?.input
						)}
						required
					/>
					{#if errors.name}
						<p class="text-destructive text-sm">{errors.name}</p>
					{/if}
				</div>

				<Button
					type="submit"
					disabled={isProcessing || !hasChanges}
					class={cn('w-full', classNames?.button)}
				>
					{#if isUpdating}
						<Loader2 class="mr-2 size-4 animate-spin" />
					{/if}
					{isUpdating
						? localization.UPDATING || 'Updating...'
						: localization.UPDATE_NAME || 'Update Name'}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
{/if}
