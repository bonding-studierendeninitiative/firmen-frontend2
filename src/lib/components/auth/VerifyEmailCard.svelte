<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { client } from '$lib/auth-client';
	import { Loader2, CheckCircle2, AlertCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';

	interface Props {
		email?: string;
		onSuccess?: () => void;
		onError?: (error: any) => void;
	}

	let { email = '', onSuccess, onError }: Props = $props();

	let emailValue = $state(email);
	let loading = $state(false);
	let submitted = $state(false);
	let error = $state('');

	async function handleSubmit() {
		if (!emailValue.trim()) {
			error = 'Email is required';
			return;
		}

		loading = true;
		error = '';

		try {
			await client.sendVerificationEmail({
				email: emailValue
			});

			submitted = true;
			toast.success('Verification email sent!');
			onSuccess?.();
		} catch (err: any) {
			error = err?.message || 'Failed to send verification email';
			onError?.(err);
		} finally {
			loading = false;
		}
	}

	function handleBack() {
		submitted = false;
		error = '';
	}
</script>

{#if submitted}
	<Card.Root class="w-full max-w-md">
		<Card.Header class="text-center">
			<div
				class="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-green-100"
			>
				<CheckCircle2 class="h-6 w-6 text-green-600" />
			</div>
			<Card.Title>Check your email</Card.Title>
			<Card.Description>
				We sent a verification link to <strong>{emailValue}</strong>
			</Card.Description>
		</Card.Header>
		<Card.Content>
			<p class="text-sm text-muted-foreground text-center">
				Click the link in the email to verify your account. If you don't see the email, check your
				spam folder.
			</p>
		</Card.Content>
		<Card.Footer>
			<Button variant="outline" class="w-full" onclick={handleBack}>Back</Button>
		</Card.Footer>
	</Card.Root>
{:else}
	<Card.Root class="w-full max-w-md">
		<Card.Header>
			<Card.Title>Verify Email</Card.Title>
			<Card.Description>Enter your email address to receive a verification link</Card.Description>
		</Card.Header>
		<Card.Content>
			<form
				onsubmit={(e) => {
					e.preventDefault();
					handleSubmit();
				}}
			>
				<div class="grid gap-2">
					<Label for="email">Email</Label>
					<Input
						id="email"
						type="email"
						placeholder="m@example.com"
						bind:value={emailValue}
						required
						disabled={loading}
					/>
					{#if error}
						<div class="flex items-center gap-2 text-sm text-destructive">
							<AlertCircle class="h-4 w-4" />
							<span>{error}</span>
						</div>
					{/if}
				</div>
				<Button type="submit" class="w-full mt-4" disabled={loading}>
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Sending...
					{:else}
						Send verification email
					{/if}
				</Button>
			</form>
		</Card.Content>
	</Card.Root>
{/if}
