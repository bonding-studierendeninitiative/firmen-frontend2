<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import * as Table from '$lib/components/ui/table';
	import { Badge } from '$lib/components/ui/badge';
	import { client } from '$lib/auth-client';
	import { Laptop, Smartphone, Trash, Loader2, AlertCircle } from '@lucide/svelte';
	import { toast } from 'svelte-sonner';
	import { onMount } from 'svelte';

	interface Session {
		id: string;
		userAgent: string;
		createdAt: string;
		lastAccessed: string;
		ipAddress: string;
		isCurrent: boolean;
	}

	interface Props {
		onSessionRevoked?: () => void;
	}

	let { onSessionRevoked }: Props = $props();

	let sessions = $state<Session[]>([]);
	let loading = $state(false);
	let revoking = $state<string>('');

	onMount(async () => {
		await loadSessions();
	});

	async function loadSessions() {
		loading = true;
		try {
			const response = await client.listSessions();
			sessions = response.data || [];
		} catch (error) {
			console.error('Failed to load sessions:', error);
			toast.error('Failed to load sessions');
		} finally {
			loading = false;
		}
	}

	async function revokeSession(sessionId: string) {
		revoking = sessionId;
		try {
			await client.revokeSession({
				sessionId
			});

			toast.success('Session revoked successfully');
			await loadSessions();
			onSessionRevoked?.();
		} catch (error: any) {
			toast.error(error?.message || 'Failed to revoke session');
		} finally {
			revoking = '';
		}
	}

	async function revokeAllOtherSessions() {
		revoking = 'all';
		try {
			await client.revokeOtherSessions();

			toast.success('All other sessions revoked successfully');
			await loadSessions();
			onSessionRevoked?.();
		} catch (error: any) {
			toast.error(error?.message || 'Failed to revoke sessions');
		} finally {
			revoking = '';
		}
	}

	function getDeviceIcon(userAgent: string): any {
		if (
			userAgent.toLowerCase().includes('mobile') ||
			userAgent.toLowerCase().includes('android') ||
			userAgent.toLowerCase().includes('iphone')
		) {
			return Smartphone;
		}
		return Laptop;
	}

	function getDeviceInfo(userAgent: string): { browser: string; os: string } {
		// Simple user agent parsing - in a real app you'd use a proper library
		let browser = 'Unknown';
		let os = 'Unknown';

		if (userAgent.includes('Chrome')) browser = 'Chrome';
		else if (userAgent.includes('Firefox')) browser = 'Firefox';
		else if (userAgent.includes('Safari')) browser = 'Safari';
		else if (userAgent.includes('Edge')) browser = 'Edge';

		if (userAgent.includes('Windows')) os = 'Windows';
		else if (userAgent.includes('Mac')) os = 'macOS';
		else if (userAgent.includes('Linux')) os = 'Linux';
		else if (userAgent.includes('Android')) os = 'Android';
		else if (userAgent.includes('iOS')) os = 'iOS';

		return { browser, os };
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	}

	const otherSessions = $derived(sessions.filter((session) => !session.isCurrent));
</script>

<Card.Root>
	<Card.Header>
		<div class="flex items-center justify-between">
			<div>
				<Card.Title>Active Sessions</Card.Title>
				<Card.Description>Manage your active sessions across different devices</Card.Description>
			</div>
			{#if otherSessions.length > 0}
				<Button
					variant="destructive"
					size="sm"
					onclick={revokeAllOtherSessions}
					disabled={revoking === 'all'}
				>
					{#if revoking === 'all'}
						<Loader2 class="mr-2 h-4 w-4 animate-spin" />
					{/if}
					Revoke All Others
				</Button>
			{/if}
		</div>
	</Card.Header>
	<Card.Content>
		{#if loading}
			<div class="flex items-center justify-center py-8">
				<Loader2 class="h-6 w-6 animate-spin" />
				<span class="ml-2">Loading sessions...</span>
			</div>
		{:else if sessions.length === 0}
			<div class="text-center py-8">
				<AlertCircle class="mx-auto h-12 w-12 text-muted-foreground" />
				<h3 class="mt-2 text-sm font-medium">No active sessions</h3>
				<p class="mt-1 text-sm text-muted-foreground">You don't have any active sessions</p>
			</div>
		{:else}
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Device</Table.Head>
						<Table.Head>Location</Table.Head>
						<Table.Head>Last Active</Table.Head>
						<Table.Head>Status</Table.Head>
						<Table.Head class="w-[100px]">Actions</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each sessions as session (session.id)}
						{@const deviceInfo = getDeviceInfo(session.userAgent)}
						{@const DeviceIcon = getDeviceIcon(session.userAgent)}
						<Table.Row>
							<Table.Cell>
								<div class="flex items-center gap-3">
									<DeviceIcon class="h-5 w-5 text-muted-foreground" />
									<div>
										<p class="font-medium">{deviceInfo.browser}</p>
										<p class="text-sm text-muted-foreground">{deviceInfo.os}</p>
									</div>
								</div>
							</Table.Cell>
							<Table.Cell>
								<span class="text-sm">{session.ipAddress}</span>
							</Table.Cell>
							<Table.Cell>
								<span class="text-sm">{formatDate(session.lastAccessed)}</span>
							</Table.Cell>
							<Table.Cell>
								{#if session.isCurrent}
									<Badge variant="default">Current</Badge>
								{:else}
									<Badge variant="secondary">Active</Badge>
								{/if}
							</Table.Cell>
							<Table.Cell>
								{#if !session.isCurrent}
									<Button
										variant="outline"
										size="sm"
										onclick={() => revokeSession(session.id)}
										disabled={revoking === session.id}
									>
										{#if revoking === session.id}
											<Loader2 class="h-4 w-4 animate-spin" />
										{:else}
											<Trash class="h-4 w-4" />
										{/if}
									</Button>
								{/if}
							</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		{/if}
	</Card.Content>
</Card.Root>
