<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { client } from '$lib/auth-client';
	import { Loader2, AlertCircle, CheckCircle2, QrCode } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import * as Dialog from '$lib/components/ui/dialog';
	import PasswordInput from './PasswordInput.svelte';

	interface Props {
		onTwoFactorEnabled?: () => void;
		onTwoFactorDisabled?: () => void;
	}

	let { onTwoFactorEnabled, onTwoFactorDisabled }: Props = $props();

	let password = $state('');
	let totpCode = $state('');
	let loading = $state(false);
	let showQR = $state(false);
	let qrCodeUri = $state('');
	let backupCodes = $state<string[]>([]);
	let step = $state<'password' | 'qr' | 'verify' | 'backup'>('password');

	async function handleGetQRCode() {
		if (password.length < 8) {
			toast.error('Password must be at least 8 characters');
			return;
		}

		loading = true;
		try {
			const response = await client.twoFactor.getTotpUri({
				password
			});

			qrCodeUri = response.data.totpUri;
			step = 'qr';
		} catch (error: any) {
			toast.error(error?.message || 'Failed to generate QR code');
		} finally {
			loading = false;
		}
	}

	async function handleEnableTwoFactor() {
		if (!totpCode.trim()) {
			toast.error('Please enter the verification code');
			return;
		}

		loading = true;
		try {
			const response = await client.twoFactor.enable({
				password,
				code: totpCode
			});

			backupCodes = response.data.backupCodes || [];
			step = 'backup';
			toast.success('Two-factor authentication enabled');
			onTwoFactorEnabled?.();
		} catch (error: any) {
			toast.error(error?.message || 'Failed to enable two-factor authentication');
		} finally {
			loading = false;
		}
	}

	async function handleDisableTwoFactor() {
		if (password.length < 8) {
			toast.error('Password must be at least 8 characters');
			return;
		}

		loading = true;
		try {
			await client.twoFactor.disable({
				password
			});

			toast.success('Two-factor authentication disabled');
			showQR = false;
			resetState();
			onTwoFactorDisabled?.();
		} catch (error: any) {
			toast.error(error?.message || 'Failed to disable two-factor authentication');
		} finally {
			loading = false;
		}
	}

	function resetState() {
		password = '';
		totpCode = '';
		step = 'password';
		qrCodeUri = '';
		backupCodes = [];
	}

	function handleDialogClose() {
		showQR = false;
		resetState();
	}
</script>

<Dialog.Root bind:open={showQR} onOpenChange={handleDialogClose}>
	<Dialog.Trigger asChild let:builder>
		<Button builders={[builder]} variant="outline" class="gap-2">
			<QrCode size={16} />
			Setup 2FA
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Two-Factor Authentication</Dialog.Title>
			<Dialog.Description>
				{#if step === 'password'}
					Enter your password to continue
				{:else if step === 'qr'}
					Scan the QR code with your authenticator app
				{:else if step === 'verify'}
					Enter the code from your authenticator app
				{:else if step === 'backup'}
					Save your backup codes
				{/if}
			</Dialog.Description>
		</Dialog.Header>

		{#if step === 'password'}
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="password">Password</Label>
					<PasswordInput id="password" bind:value={password} placeholder="Enter your password" />
				</div>
				<Button onclick={handleGetQRCode} disabled={loading}>
					{#if loading}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
						Generating...
					{:else}
						Show QR Code
					{/if}
				</Button>
			</div>
		{:else if step === 'qr'}
			<div class="grid gap-4 text-center">
				{#if qrCodeUri}
					<div class="mx-auto p-4 bg-white rounded-lg">
						<!-- In a real implementation, you'd use a QR code library here -->
						<div
							class="w-48 h-48 border-2 border-dashed border-gray-300 flex items-center justify-center"
						>
							<p class="text-sm text-gray-500">QR Code: {qrCodeUri}</p>
						</div>
					</div>
				{/if}
				<p class="text-sm text-muted-foreground">
					Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
				</p>
				<Button onclick={() => (step = 'verify')}>I've scanned the code</Button>
			</div>
		{:else if step === 'verify'}
			<div class="grid gap-4">
				<div class="grid gap-2">
					<Label for="code">Verification Code</Label>
					<Input
						id="code"
						placeholder="Enter 6-digit code"
						bind:value={totpCode}
						maxlength="6"
						pattern="[0-9]{6}"
					/>
				</div>
				<div class="flex gap-2">
					<Button variant="outline" onclick={() => (step = 'qr')}>Back</Button>
					<Button onclick={handleEnableTwoFactor} disabled={loading} class="flex-1">
						{#if loading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Enabling...
						{:else}
							Enable 2FA
						{/if}
					</Button>
				</div>
			</div>
		{:else if step === 'backup'}
			<div class="grid gap-4">
				<div class="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
					<div class="flex items-start gap-2">
						<AlertCircle class="h-5 w-5 text-yellow-600 mt-0.5" />
						<div>
							<h4 class="font-medium text-yellow-800">Save your backup codes</h4>
							<p class="text-sm text-yellow-700 mt-1">
								Store these codes in a safe place. You can use them to access your account if you
								lose your authenticator device.
							</p>
						</div>
					</div>
				</div>
				{#if backupCodes.length > 0}
					<div class="grid grid-cols-2 gap-2 p-4 bg-gray-50 rounded-lg font-mono text-sm">
						{#each backupCodes as code}
							<div class="p-2 bg-white rounded border">{code}</div>
						{/each}
					</div>
				{/if}
				<Button onclick={handleDialogClose} class="w-full">
					<CheckCircle2 class="mr-2 h-4 w-4" />
					I've saved my backup codes
				</Button>
			</div>
		{/if}
	</Dialog.Content>
</Dialog.Root>

<!-- Disable 2FA Button -->
<Dialog.Root>
	<Dialog.Trigger asChild let:builder>
		<Button builders={[builder]} variant="destructive" class="gap-2">
			<AlertCircle size={16} />
			Disable 2FA
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Disable Two-Factor Authentication</Dialog.Title>
			<Dialog.Description>
				Enter your password to disable two-factor authentication
			</Dialog.Description>
		</Dialog.Header>
		<div class="grid gap-4">
			<div class="grid gap-2">
				<Label for="disable-password">Password</Label>
				<PasswordInput
					id="disable-password"
					bind:value={password}
					placeholder="Enter your password"
				/>
			</div>
			<Button onclick={handleDisableTwoFactor} disabled={loading} variant="destructive">
				{#if loading}
					<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					Disabling...
				{:else}
					Disable 2FA
				{/if}
			</Button>
		</div>
	</Dialog.Content>
</Dialog.Root>
