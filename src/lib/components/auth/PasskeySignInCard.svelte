<script lang="ts">
	import { cn } from '@/utils';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Skeleton } from '@/components/ui/skeleton';
	import { KeyRound, Loader2 } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			header?: string;
			title?: string;
			description?: string;
			content?: string;
			button?: string;
			skeleton?: string;
		};
		localization?: any;
		redirectTo?: string;
		onSuccess?: () => void;
		onError?: (error: Error) => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		redirectTo = '/dashboard',
		onSuccess,
		onError
	}: Props = $props();

	let isPending = $state(false);
	let isSigningIn = $state(false);
	let isProcessing = $derived(isSigningIn);

	async function handlePasskeySignIn() {
		isSigningIn = true;
		try {
			// Check if WebAuthn is supported
			if (!window.PublicKeyCredential) {
				throw new Error('WebAuthn is not supported in this browser');
			}

			// Mock passkey authentication - would use actual WebAuthn API
			await new Promise((resolve) => setTimeout(resolve, 2000));

			// Mock success
			toast.success(localization.SIGN_IN_SUCCESS || 'Signed in successfully!');
			onSuccess?.();

			// Would redirect to dashboard in real implementation
		} catch (error) {
			const errorMessage =
				error instanceof Error ? error.message : 'Failed to sign in with passkey';
			toast.error(localization.SIGN_IN_ERROR || errorMessage);
			onError?.(error instanceof Error ? error : new Error(errorMessage));
		} finally {
			isSigningIn = false;
		}
	}

	function isWebAuthnSupported() {
		return typeof window !== 'undefined' && window.PublicKeyCredential !== undefined;
	}
</script>

{#if isPending}
	<!-- Loading skeleton -->
	<Card.Root class={cn('w-full max-w-sm', className, classNames?.base)}>
		<Card.Header class={cn('text-center', classNames?.header)}>
			<Skeleton class={cn('mx-auto h-5 w-40 md:h-5.5 md:w-48', classNames?.skeleton)} />
			<Skeleton class={cn('h-3 w-full max-w-56 md:h-3.5 md:w-64', classNames?.skeleton)} />
		</Card.Header>

		<Card.Content class={classNames?.content}>
			<Skeleton class={cn('h-10 w-full', classNames?.skeleton)} />
		</Card.Content>
	</Card.Root>
{:else}
	<Card.Root class={cn('w-full max-w-sm', className, classNames?.base)}>
		<Card.Header class={cn('text-center', classNames?.header)}>
			<Card.Title class={cn('text-lg md:text-xl', classNames?.title)}>
				{localization.SIGN_IN_WITH_PASSKEY || 'Sign in with Passkey'}
			</Card.Title>
			<Card.Description class={cn('text-xs md:text-sm', classNames?.description)}>
				{localization.PASSKEY_DESCRIPTION ||
					'Use your passkey for secure, passwordless authentication'}
			</Card.Description>
		</Card.Header>

		<Card.Content class={classNames?.content}>
			{#if !isWebAuthnSupported()}
				<div class="text-center text-sm text-muted-foreground">
					{localization.WEBAUTHN_NOT_SUPPORTED || 'Passkeys are not supported in this browser'}
				</div>
			{:else}
				<Button
					onclick={handlePasskeySignIn}
					disabled={isProcessing}
					class={cn('w-full gap-2', classNames?.button)}
					size="lg"
				>
					{#if isSigningIn}
						<Loader2 class="size-4 animate-spin" />
					{:else}
						<KeyRound class="size-4" />
					{/if}
					{isSigningIn
						? localization.SIGNING_IN || 'Signing in...'
						: localization.SIGN_IN_WITH_PASSKEY || 'Sign in with Passkey'}
				</Button>
			{/if}
		</Card.Content>
	</Card.Root>
{/if}
