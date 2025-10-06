<script lang="ts">
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Loader2, ArrowLeft, Mail } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			button?: string;
			input?: string;
			label?: string;
			error?: string;
			backButton?: string;
		};
		localization?: any;
		isSubmitting?: boolean;
		setIsSubmitting?: (value: boolean) => void;
		onBack?: () => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		isSubmitting = false,
		setIsSubmitting,
		onBack
	}: Props = $props();

	let email = $state('');
	let error = $state('');
	let isLoading = $state(false);
	let linkSent = $state(false);

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!email) {
			error = localization.EMAIL_REQUIRED || 'Email is required';
			return;
		}

		if (!email.includes('@')) {
			error = localization.INVALID_EMAIL || 'Please enter a valid email address';
			return;
		}

		isLoading = true;
		setIsSubmitting?.(true);
		error = '';

		try {
			// Mock API call - replace with actual magic link API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			linkSent = true;
			toast.success(localization.MAGIC_LINK_SENT || 'Magic link sent to your email');
		} catch (err) {
			error = localization.MAGIC_LINK_ERROR || 'Failed to send magic link. Please try again.';
			toast.error(error);
		} finally {
			isLoading = false;
			setIsSubmitting?.(false);
		}
	}

	function handleBack() {
		if (linkSent) {
			linkSent = false;
			email = '';
			error = '';
		} else {
			onBack?.();
		}
	}
</script>

<div class={cn('w-full space-y-6', className, classNames?.base)}>
	{#if linkSent}
		<!-- Success state -->
		<div class="text-center space-y-4">
			<div class="flex justify-center">
				<div class="rounded-full bg-green-100 p-3">
					<Mail class="size-6 text-green-600" />
				</div>
			</div>
			<div class="space-y-2">
				<h3 class="text-lg font-medium">
					{localization.CHECK_EMAIL || 'Check your email'}
				</h3>
				<p class="text-sm text-muted-foreground">
					{localization.MAGIC_LINK_DESCRIPTION ||
						`We've sent a magic link to ${email}. Click the link in your email to sign in.`}
				</p>
			</div>
			<Button type="button" variant="outline" onclick={handleBack} class={classNames?.backButton}>
				<ArrowLeft class="mr-2 size-4" />
				{localization.BACK || 'Back'}
			</Button>
		</div>
	{:else}
		<!-- Form state -->
		<div class="space-y-4">
			<div class="text-center space-y-2">
				<h3 class="text-lg font-medium">
					{localization.MAGIC_LINK_TITLE || 'Sign in with magic link'}
				</h3>
				<p class="text-sm text-muted-foreground">
					{localization.MAGIC_LINK_SUBTITLE ||
						"Enter your email address and we'll send you a magic link to sign in"}
				</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-2">
					<Label for="email" class={classNames?.label}>
						{localization.EMAIL || 'Email'}
					</Label>
					<Input
						id="email"
						type="email"
						bind:value={email}
						placeholder={localization.EMAIL_PLACEHOLDER || 'Enter your email address'}
						disabled={isLoading}
						required
						class={cn(classNames?.input)}
					/>
				</div>

				{#if error}
					<div class={cn('text-sm text-destructive', classNames?.error)}>
						{error}
					</div>
				{/if}

				<div class="space-y-3">
					<Button
						type="submit"
						disabled={isLoading || !email}
						class={cn('w-full', classNames?.button)}
					>
						{#if isLoading}
							<Loader2 class="mr-2 size-4 animate-spin" />
						{/if}
						{localization.SEND_MAGIC_LINK || 'Send magic link'}
					</Button>

					{#if onBack}
						<Button
							type="button"
							variant="outline"
							onclick={handleBack}
							class={cn('w-full', classNames?.backButton)}
						>
							<ArrowLeft class="mr-2 size-4" />
							{localization.BACK_TO_SIGN_IN || 'Back to sign in'}
						</Button>
					{/if}
				</div>
			</form>
		</div>
	{/if}
</div>
