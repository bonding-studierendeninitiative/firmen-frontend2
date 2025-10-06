<script lang="ts">
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import { Loader2, Eye, EyeOff, CheckCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			button?: string;
			input?: string;
			label?: string;
			error?: string;
		};
		localization?: any;
		isSubmitting?: boolean;
		setIsSubmitting?: (value: boolean) => void;
		token?: string;
		onSuccess?: () => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		isSubmitting = false,
		setIsSubmitting,
		token = '',
		onSuccess
	}: Props = $props();

	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let isLoading = $state(false);
	let showPassword = $state(false);
	let showConfirmPassword = $state(false);
	let resetComplete = $state(false);

	// Password validation
	let passwordValidation = $derived({
		minLength: password.length >= 8,
		hasNumber: /\d/.test(password),
		hasLower: /[a-z]/.test(password),
		hasUpper: /[A-Z]/.test(password),
		hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password)
	});

	let isPasswordValid = $derived(
		passwordValidation.minLength &&
			passwordValidation.hasNumber &&
			passwordValidation.hasLower &&
			passwordValidation.hasUpper &&
			passwordValidation.hasSpecial
	);

	let passwordsMatch = $derived(password === confirmPassword && confirmPassword.length > 0);

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!password) {
			error = localization.PASSWORD_REQUIRED || 'Password is required';
			return;
		}

		if (!isPasswordValid) {
			error = localization.PASSWORD_REQUIREMENTS_NOT_MET || 'Password does not meet requirements';
			return;
		}

		if (!confirmPassword) {
			error = localization.CONFIRM_PASSWORD_REQUIRED || 'Please confirm your password';
			return;
		}

		if (password !== confirmPassword) {
			error = localization.PASSWORDS_DO_NOT_MATCH || 'Passwords do not match';
			return;
		}

		if (!token) {
			error = localization.INVALID_RESET_TOKEN || 'Invalid reset token';
			return;
		}

		isLoading = true;
		setIsSubmitting?.(true);
		error = '';

		try {
			// Mock API call - replace with actual password reset API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			resetComplete = true;
			toast.success(localization.PASSWORD_RESET_SUCCESS || 'Password reset successfully');

			// Redirect after success
			setTimeout(() => {
				onSuccess?.();
			}, 2000);
		} catch (err) {
			error = localization.PASSWORD_RESET_ERROR || 'Failed to reset password. Please try again.';
			toast.error(error);
		} finally {
			isLoading = false;
			setIsSubmitting?.(false);
		}
	}
</script>

<div class={cn('w-full space-y-6', className, classNames?.base)}>
	{#if resetComplete}
		<!-- Success state -->
		<div class="text-center space-y-4">
			<div class="flex justify-center">
				<div class="rounded-full bg-green-100 p-3">
					<CheckCircle class="size-6 text-green-600" />
				</div>
			</div>
			<div class="space-y-2">
				<h3 class="text-lg font-medium text-green-600">
					{localization.PASSWORD_RESET_COMPLETE || 'Password reset complete'}
				</h3>
				<p class="text-sm text-muted-foreground">
					{localization.PASSWORD_RESET_SUCCESS_DESCRIPTION ||
						'Your password has been successfully reset. You will be redirected to sign in.'}
				</p>
			</div>
		</div>
	{:else}
		<!-- Form state -->
		<div class="space-y-4">
			<div class="text-center space-y-2">
				<h3 class="text-lg font-medium">
					{localization.RESET_PASSWORD_TITLE || 'Reset your password'}
				</h3>
				<p class="text-sm text-muted-foreground">
					{localization.RESET_PASSWORD_SUBTITLE || 'Enter a new password for your account'}
				</p>
			</div>

			<form onsubmit={handleSubmit} class="space-y-4">
				<div class="space-y-2">
					<Label for="password" class={classNames?.label}>
						{localization.NEW_PASSWORD || 'New password'}
					</Label>
					<div class="relative">
						<Input
							id="password"
							type={showPassword ? 'text' : 'password'}
							bind:value={password}
							placeholder={localization.PASSWORD_PLACEHOLDER || 'Enter new password'}
							disabled={isLoading}
							required
							class={cn('pr-10', classNames?.input)}
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
							onclick={() => (showPassword = !showPassword)}
						>
							{#if showPassword}
								<EyeOff class="size-4" />
							{:else}
								<Eye class="size-4" />
							{/if}
						</Button>
					</div>

					<!-- Password requirements -->
					{#if password}
						<div class="space-y-1 text-xs">
							<div
								class={cn(
									'flex items-center gap-2',
									passwordValidation.minLength ? 'text-green-600' : 'text-muted-foreground'
								)}
							>
								<CheckCircle
									class={cn(
										'size-3',
										passwordValidation.minLength ? 'text-green-600' : 'text-gray-300'
									)}
								/>
								{localization.MIN_8_CHARACTERS || 'At least 8 characters'}
							</div>
							<div
								class={cn(
									'flex items-center gap-2',
									passwordValidation.hasNumber ? 'text-green-600' : 'text-muted-foreground'
								)}
							>
								<CheckCircle
									class={cn(
										'size-3',
										passwordValidation.hasNumber ? 'text-green-600' : 'text-gray-300'
									)}
								/>
								{localization.CONTAINS_NUMBER || 'Contains a number'}
							</div>
							<div
								class={cn(
									'flex items-center gap-2',
									passwordValidation.hasLower ? 'text-green-600' : 'text-muted-foreground'
								)}
							>
								<CheckCircle
									class={cn(
										'size-3',
										passwordValidation.hasLower ? 'text-green-600' : 'text-gray-300'
									)}
								/>
								{localization.CONTAINS_LOWERCASE || 'Contains lowercase letter'}
							</div>
							<div
								class={cn(
									'flex items-center gap-2',
									passwordValidation.hasUpper ? 'text-green-600' : 'text-muted-foreground'
								)}
							>
								<CheckCircle
									class={cn(
										'size-3',
										passwordValidation.hasUpper ? 'text-green-600' : 'text-gray-300'
									)}
								/>
								{localization.CONTAINS_UPPERCASE || 'Contains uppercase letter'}
							</div>
							<div
								class={cn(
									'flex items-center gap-2',
									passwordValidation.hasSpecial ? 'text-green-600' : 'text-muted-foreground'
								)}
							>
								<CheckCircle
									class={cn(
										'size-3',
										passwordValidation.hasSpecial ? 'text-green-600' : 'text-gray-300'
									)}
								/>
								{localization.CONTAINS_SPECIAL || 'Contains special character'}
							</div>
						</div>
					{/if}
				</div>

				<div class="space-y-2">
					<Label for="confirm-password" class={classNames?.label}>
						{localization.CONFIRM_PASSWORD || 'Confirm password'}
					</Label>
					<div class="relative">
						<Input
							id="confirm-password"
							type={showConfirmPassword ? 'text' : 'password'}
							bind:value={confirmPassword}
							placeholder={localization.CONFIRM_PASSWORD_PLACEHOLDER || 'Confirm new password'}
							disabled={isLoading}
							required
							class={cn('pr-10', classNames?.input)}
						/>
						<Button
							type="button"
							variant="ghost"
							size="sm"
							class="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
							onclick={() => (showConfirmPassword = !showConfirmPassword)}
						>
							{#if showConfirmPassword}
								<EyeOff class="size-4" />
							{:else}
								<Eye class="size-4" />
							{/if}
						</Button>
					</div>

					{#if confirmPassword && !passwordsMatch}
						<div class="text-xs text-destructive">
							{localization.PASSWORDS_DO_NOT_MATCH || 'Passwords do not match'}
						</div>
					{:else if confirmPassword && passwordsMatch}
						<div class="text-xs text-green-600 flex items-center gap-1">
							<CheckCircle class="size-3" />
							{localization.PASSWORDS_MATCH || 'Passwords match'}
						</div>
					{/if}
				</div>

				{#if error}
					<div class={cn('text-sm text-destructive', classNames?.error)}>
						{error}
					</div>
				{/if}

				<Button
					type="submit"
					disabled={isLoading ||
						!password ||
						!confirmPassword ||
						!isPasswordValid ||
						!passwordsMatch}
					class={cn('w-full', classNames?.button)}
				>
					{#if isLoading}
						<Loader2 class="mr-2 size-4 animate-spin" />
					{/if}
					{localization.RESET_PASSWORD || 'Reset password'}
				</Button>
			</form>
		</div>
	{/if}
</div>
