<script lang="ts">
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Loader2, ArrowLeft, Shield } from '@lucide/svelte';
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
	let recoveryCode = $state('');
	let error = $state('');
	let isLoading = $state(false);
	let step = $state<'email' | 'code' | 'success'>('email');

	async function handleEmailSubmit(event: Event) {
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
			// Mock API call - replace with actual recovery initiation API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			step = 'code';
			toast.success(localization.RECOVERY_CODE_SENT || 'Recovery code sent to your email');
		} catch (err) {
			error =
				localization.RECOVERY_EMAIL_ERROR || 'Failed to send recovery code. Please try again.';
			toast.error(error);
		} finally {
			isLoading = false;
			setIsSubmitting?.(false);
		}
	}

	async function handleCodeSubmit(event: Event) {
		event.preventDefault();

		if (!recoveryCode) {
			error = localization.RECOVERY_CODE_REQUIRED || 'Recovery code is required';
			return;
		}

		if (recoveryCode.length < 6) {
			error = localization.INVALID_RECOVERY_CODE || 'Please enter a valid recovery code';
			return;
		}

		isLoading = true;
		setIsSubmitting?.(true);
		error = '';

		try {
			// Mock API call - replace with actual account recovery API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			step = 'success';
			toast.success(localization.ACCOUNT_RECOVERED || 'Account recovered successfully');
		} catch (err) {
			error = localization.INVALID_RECOVERY_CODE || 'Invalid recovery code. Please try again.';
			toast.error(error);
		} finally {
			isLoading = false;
			setIsSubmitting?.(false);
		}
	}

	function handleBack() {
		if (step === 'code') {
			step = 'email';
			recoveryCode = '';
			error = '';
		} else if (step === 'success') {
			step = 'email';
			email = '';
			recoveryCode = '';
			error = '';
		} else {
			onBack?.();
		}
	}
</script>

<div class={cn('w-full space-y-6', className, classNames?.base)}>
	{#if step === 'success'}
		<!-- Success state -->
		<div class="text-center space-y-4">
			<div class="flex justify-center">
				<div class="rounded-full bg-green-100 p-3">
					<Shield class="size-6 text-green-600" />
				</div>
			</div>
			<div class="space-y-2">
				<h3 class="text-lg font-medium text-green-600">
					{localization.ACCOUNT_RECOVERED || 'Account recovered'}
				</h3>
				<p class="text-sm text-muted-foreground">
					{localization.ACCOUNT_RECOVERY_SUCCESS ||
						'Your account has been successfully recovered. You can now sign in.'}
				</p>
			</div>
			<Button type="button" onclick={handleBack} class={classNames?.button}>
				{localization.CONTINUE_TO_SIGN_IN || 'Continue to sign in'}
			</Button>
		</div>
	{:else if step === 'code'}
		<!-- Code verification step -->
		<div class="space-y-4">
			<div class="text-center space-y-2">
				<h3 class="text-lg font-medium">
					{localization.ENTER_RECOVERY_CODE || 'Enter recovery code'}
				</h3>
				<p class="text-sm text-muted-foreground">
					{localization.RECOVERY_CODE_DESCRIPTION || `We've sent a recovery code to ${email}`}
				</p>
			</div>

			<form onsubmit={handleCodeSubmit} class="space-y-4">
				<div class="space-y-2">
					<Label for="recovery-code" class={classNames?.label}>
						{localization.RECOVERY_CODE || 'Recovery code'}
					</Label>
					<Input
						id="recovery-code"
						type="text"
						bind:value={recoveryCode}
						placeholder={localization.RECOVERY_CODE_PLACEHOLDER || 'Enter 6-digit code'}
						disabled={isLoading}
						required
						class={cn('text-center tracking-widest', classNames?.input)}
						maxlength={6}
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
						disabled={isLoading || !recoveryCode}
						class={cn('w-full', classNames?.button)}
					>
						{#if isLoading}
							<Loader2 class="mr-2 size-4 animate-spin" />
						{/if}
						{localization.RECOVER_ACCOUNT || 'Recover account'}
					</Button>

					<Button
						type="button"
						variant="outline"
						onclick={handleBack}
						class={cn('w-full', classNames?.backButton)}
					>
						<ArrowLeft class="mr-2 size-4" />
						{localization.BACK || 'Back'}
					</Button>
				</div>
			</form>
		</div>
	{:else}
		<!-- Email step -->
		<div class="space-y-4">
			<div class="text-center space-y-2">
				<h3 class="text-lg font-medium">
					{localization.RECOVER_ACCOUNT_TITLE || 'Recover your account'}
				</h3>
				<p class="text-sm text-muted-foreground">
					{localization.RECOVER_ACCOUNT_SUBTITLE ||
						'Enter your email address to receive a recovery code'}
				</p>
			</div>

			<form onsubmit={handleEmailSubmit} class="space-y-4">
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
						{localization.SEND_RECOVERY_CODE || 'Send recovery code'}
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
