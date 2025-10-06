<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Dialog from '$lib/components/ui/dialog';
	import { client } from '$lib/auth-client';
	import { Fingerprint, Loader2, Plus, Trash } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	interface Passkey {
		id: string;
		name: string;
		createdAt: string;
	}

	interface Props {
		onPasskeyAdded?: () => void;
		onPasskeyRemoved?: () => void;
	}

	let { onPasskeyAdded, onPasskeyRemoved }: Props = $props();

	let passkeys = $state<Passkey[]>([]);
	let showAddDialog = $state(false);
	let passkeyName = $state('');
	let loading = $state(false);
	let loadingId = $state<string>('');

	onMount(async () => {
		await loadPasskeys();
	});

	async function loadPasskeys() {
		try {
			const response = await client.listPasskeys();
			passkeys = response.data || [];
		} catch (error) {
			console.error('Failed to load passkeys:', error);
		}
	}

	async function handleAddPasskey() {
		if (!passkeyName.trim()) {
			toast.error('Please enter a name for your passkey');
			return;
		}

		loading = true;
		try {
			await client.addPasskey({
				name: passkeyName
			});

			toast.success('Passkey added successfully');
			showAddDialog = false;
			passkeyName = '';
			await loadPasskeys();
			onPasskeyAdded?.();
		} catch (error: any) {
			toast.error(error?.message || 'Failed to add passkey');
		} finally {
			loading = false;
		}
	}

	async function handleRemovePasskey(passkeyId: string) {
		loadingId = passkeyId;
		try {
			await client.deletePasskey({
				id: passkeyId
			});

			toast.success('Passkey removed successfully');
			await loadPasskeys();
			onPasskeyRemoved?.();
		} catch (error: any) {
			toast.error(error?.message || 'Failed to remove passkey');
		} finally {
			loadingId = '';
		}
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString();
	}
</script>

<Card.Root>
	<Card.Header>
		<Card.Title class="flex items-center gap-2">
			<Fingerprint class="h-5 w-5" />
			Passkeys
		</Card.Title>
		<Card.Description>Manage your passkeys for passwordless authentication</Card.Description>
	</Card.Header>
	<Card.Content class="space-y-4">
		{#if passkeys.length === 0}
			<div class="text-center py-6">
				<Fingerprint class="mx-auto h-12 w-12 text-muted-foreground" />
				<h3 class="mt-2 text-sm font-medium">No passkeys</h3>
				<p class="mt-1 text-sm text-muted-foreground">
					Add a passkey to enable passwordless sign-in
				</p>
			</div>
		{:else}
			<div class="space-y-3">
				{#each passkeys as passkey (passkey.id)}
					<div class="flex items-center justify-between p-3 border rounded-lg">
						<div class="flex items-center gap-3">
							<Fingerprint class="h-5 w-5 text-muted-foreground" />
							<div>
								<p class="font-medium">{passkey.name}</p>
								<p class="text-sm text-muted-foreground">
									Added {formatDate(passkey.createdAt)}
								</p>
							</div>
						</div>
						<Button
							variant="outline"
							size="sm"
							onclick={() => handleRemovePasskey(passkey.id)}
							disabled={loadingId === passkey.id}
						>
							{#if loadingId === passkey.id}
								<Loader2 class="h-4 w-4 animate-spin" />
							{:else}
								<Trash class="h-4 w-4" />
							{/if}
						</Button>
					</div>
				{/each}
			</div>
		{/if}
	</Card.Content>
	<Card.Footer>
		<Dialog.Root bind:open={showAddDialog}>
			<Dialog.Trigger asChild let:builder>
				<Button builders={[builder]} class="w-full gap-2">
					<Plus class="h-4 w-4" />
					Add Passkey
				</Button>
			</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[425px]">
				<Dialog.Header>
					<Dialog.Title>Add New Passkey</Dialog.Title>
					<Dialog.Description>
						Create a new passkey to securely access your account without a password.
					</Dialog.Description>
				</Dialog.Header>
				<div class="grid gap-2">
					<Label for="passkey-name">Passkey Name</Label>
					<Input
						id="passkey-name"
						bind:value={passkeyName}
						placeholder="e.g., My iPhone, Work Laptop"
					/>
				</div>
				<Dialog.Footer>
					<Button onclick={handleAddPasskey} disabled={loading} class="w-full">
						{#if loading}
							<Loader2 class="mr-2 h-4 w-4 animate-spin" />
							Creating...
						{:else}
							<Fingerprint class="mr-2 h-4 w-4" />
							Create Passkey
						{/if}
					</Button>
				</Dialog.Footer>
			</Dialog.Content>
		</Dialog.Root>
	</Card.Footer>
</Card.Root>
