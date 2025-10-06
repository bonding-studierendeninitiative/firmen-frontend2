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
		onSuccess?: () => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		isSubmitting = false,
		setIsSubmitting,
		onBack,
		onSuccess
	}: Props = $props();

	let code = $state('');
	let error = $state('');
	let isLoading = $state(false);

	// Split code into individual digits for better UX
	let codeDigits = $state(['', '', '', '', '', '']);

	function updateCode() {
		code = codeDigits.join('');
	}

	function handleDigitInput(index: number, event: Event) {
		const target = event.target as HTMLInputElement;
		const value = target.value.replace(/[^0-9]/g, '').slice(-1); // Only allow numbers, take last digit

		codeDigits[index] = value;
		updateCode();

		// Auto-focus next input
		if (value && index < 5) {
			const nextInput = target.parentElement?.nextElementSibling?.querySelector('input');
			nextInput?.focus();
		}
	}

	function handleDigitKeydown(index: number, event: KeyboardEvent) {
		// Handle backspace
		if (event.key === 'Backspace' && !codeDigits[index] && index > 0) {
			const prevInput = (
				event.target as HTMLInputElement
			).parentElement?.previousElementSibling?.querySelector('input');
			prevInput?.focus();
		}

		// Handle paste
		if (event.key === 'v' && (event.metaKey || event.ctrlKey)) {
			navigator.clipboard.readText().then((text) => {
				const digits = text
					.replace(/[^0-9]/g, '')
					.slice(0, 6)
					.split('');
				for (let i = 0; i < 6; i++) {
					codeDigits[i] = digits[i] || '';
				}
				updateCode();
			});
		}
	}

	async function handleSubmit(event: Event) {
		event.preventDefault();

		if (!code || code.length !== 6) {
			error = localization.INVALID_CODE_LENGTH || 'Please enter a 6-digit code';
			return;
		}

		isLoading = true;
		setIsSubmitting?.(true);
		error = '';

		try {
			// Mock API call - replace with actual two-factor verification API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			toast.success(localization.TWO_FACTOR_SUCCESS || 'Two-factor authentication successful');
			onSuccess?.();
		} catch (err) {
			error = localization.INVALID_CODE || 'Invalid code. Please try again.';
			toast.error(error);

			// Clear code on error
			codeDigits = ['', '', '', '', '', ''];
			updateCode();

			// Focus first input
			const firstInput = document.querySelector('.code-input input') as HTMLInputElement;
			firstInput?.focus();
		} finally {
			isLoading = false;
			setIsSubmitting?.(false);
		}
	}

	async function handleResendCode() {
		try {
			// Mock API call - replace with actual resend code API
			await new Promise((resolve) => setTimeout(resolve, 1000));
			toast.success(localization.CODE_RESENT || 'Verification code resent');
		} catch (err) {
			toast.error(localization.RESEND_ERROR || 'Failed to resend code');
		}
	}
</script>

<div class={cn('w-full space-y-6', className, classNames?.base)}>
	<div class="text-center space-y-4">
		<div class="flex justify-center">
			<div class="rounded-full bg-blue-100 p-3">
				<Shield class="size-6 text-blue-600" />
			</div>
		</div>

		<div class="space-y-2">
			<h3 class="text-lg font-medium">
				{localization.TWO_FACTOR_TITLE || 'Two-factor authentication'}
			</h3>
			<p class="text-sm text-muted-foreground">
				{localization.TWO_FACTOR_DESCRIPTION ||
					'Enter the 6-digit code from your authenticator app'}
			</p>
		</div>
	</div>

	<form onsubmit={handleSubmit} class="space-y-6">
		<div class="space-y-4">
			<Label class={cn('text-center block', classNames?.label)}>
				{localization.VERIFICATION_CODE || 'Verification code'}
			</Label>

			<!-- Code input grid -->
			<div class="flex justify-center gap-2">
				{#each codeDigits as digit, index}
					<div class="code-input">
						<Input
							type="text"
							inputmode="numeric"
							maxlength="1"
							value={digit}
							oninput={(e) => handleDigitInput(index, e)}
							onkeydown={(e) => handleDigitKeydown(index, e)}
							disabled={isLoading}
							class={cn(
								'w-12 h-12 text-center text-lg font-mono',
								'border-2 focus:border-primary',
								classNames?.input
							)}
							placeholder="•"
						/>
					</div>
				{/each}
			</div>
		</div>

		{#if error}
			<div class={cn('text-sm text-destructive text-center', classNames?.error)}>
				{error}
			</div>
		{/if}

		<div class="space-y-4">
			<Button
				type="submit"
				disabled={isLoading || code.length !== 6}
				class={cn('w-full', classNames?.button)}
			>
				{#if isLoading}
					<Loader2 class="mr-2 size-4 animate-spin" />
				{/if}
				{localization.VERIFY_CODE || 'Verify code'}
			</Button>

			<div class="flex flex-col gap-2">
				<Button
					type="button"
					variant="outline"
					onclick={handleResendCode}
					disabled={isLoading}
					class="w-full"
				>
					{localization.RESEND_CODE || 'Resend code'}
				</Button>

				{#if onBack}
					<Button
						type="button"
						variant="ghost"
						onclick={onBack}
						class={cn('w-full', classNames?.backButton)}
					>
						<ArrowLeft class="mr-2 size-4" />
						{localization.BACK || 'Back'}
					</Button>
				{/if}
			</div>
		</div>
	</form>
</div>

<style>
	.code-input input:focus {
		outline: none;
		border-color: hsl(var(--primary));
		box-shadow: 0 0 0 2px hsl(var(--primary) / 0.2);
	}
</style>
