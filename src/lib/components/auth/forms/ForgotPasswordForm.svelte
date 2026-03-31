<script lang="ts">
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import * as Card from '@/components/ui/card';
	import { Loader2, ArrowLeft } from '@lucide/svelte';
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
	let emailSent = $state(false);

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
			// Mock API call - replace with actual forgot password API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			emailSent = true;
			toast.success(localization.FORGOT_PASSWORD_EMAIL || 'Password reset link sent to your email');
		} catch (err) {
			error = localization.FORGOT_PASSWORD_ERROR || 'Failed to send reset email. Please try again.';
			toast.error(error);
		} finally {
			isLoading = false;
			setIsSubmitting?.(false);
		}
	}

	function handleBack() {
		if (emailSent) {
			emailSent = false;
			email = '';
			error = '';
		} else {
			onBack?.();
		}
	}
</script>

<div class={cn('w-full space-y-6', className, classNames?.base)}>
	{#if emailSent}
		<!-- Success state -->
		<div class="text-center space-y-4">
			<div class="text-green-600 text-lg font-medium">
				{localization.CHECK_EMAIL || 'Check your email'}
			</div>
			<p class="text-sm text-muted-foreground">
				{localization.FORGOT_PASSWORD_EMAIL_DESCRIPTION ||
					`We've sent a password reset link to ${email}`}
			</p>
			<Button type="button" variant="outline" onclick={handleBack} class={classNames?.backButton}>
				<ArrowLeft class="mr-2 size-4" />
				{localization.BACK || 'Back'}
			</Button>
		</div>
	{:else}
		<!-- Form state -->
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
					{localization.SEND_RESET_LINK || 'Send reset link'}
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
	{/if}
</div>
