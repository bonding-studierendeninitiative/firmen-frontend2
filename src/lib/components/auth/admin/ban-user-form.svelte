<script lang="ts">
	import { _ } from '@services';
	import { Button } from '$lib/components/ui/button';
	import { invalidate } from '$app/navigation';
	import authClient from '@/auth-client';
	import { Input } from '@/components/ui/input';
	import { Label } from '@/components/ui/label';
	import * as Tabs from '@/components/ui/tabs';
	import { Minus, Plus } from '@lucide/svelte';
	import { Textarea } from '@/components/ui/textarea';

	let { user } = $props();

	let banReason = $state<string>('');
	let banExpiryType = $state<'permanent' | 'temporary'>('permanent');
	let temporaryBanDurationType = $state<'hours' | 'days' | 'weeks' | 'months' | 'years'>('hours');
	let temporaryBanDuration = $state<number>(1);

	function increaseBanDuration(event: Event) {
		event.preventDefault();

		temporaryBanDuration = temporaryBanDuration + 1;
	}
	function decreaseBanDuration(event: Event) {
		event.preventDefault();
		if (temporaryBanDuration > 1) {
			temporaryBanDuration = temporaryBanDuration - 1;
		}
	}

	function calculateBanDurationInSeconds() {
		switch (temporaryBanDurationType) {
			case 'hours':
				return temporaryBanDuration * 60 * 60; // Convert hours to seconds
			case 'days':
				return temporaryBanDuration * 24 * 60 * 60; // Convert days to seconds
			case 'weeks':
				return temporaryBanDuration * 7 * 24 * 60 * 60; // Convert weeks to seconds
			case 'months':
				return temporaryBanDuration * 30 * 24 * 60 * 60; // Approximate months to seconds
			case 'years':
				return temporaryBanDuration * 365 * 24 * 60 * 60; // Approximate years to seconds
			default:
				return undefined;
		}
	}

	// Function to handle the ban user action
	async function handleBanUser(event: Event) {
		event.preventDefault();
		if (!user || !user.id) {
			console.error('User not found or invalid user ID');
			return;
		}
		await authClient.admin.banUser({
			userId: user.id,
			banReason,
			banExpiresIn: banExpiryType === 'permanent' ? undefined : calculateBanDurationInSeconds()
		});
		// TODO: Replace with callback from page
		await invalidate('trpc:admin.users.getDetails');
	}
</script>

<form onsubmit={handleBanUser}>
	<div class="space-y-4">
		<div class="flex flex-col">
			<Label for="banReason" class="text-sm font-medium text-gray-700">
				{$_('admin-pages.users.overview.banReason')}
			</Label>
			<Textarea
				id="banReason"
				name="banReason"
				bind:value={banReason}
				placeholder={$_('admin-pages.users.overview.ban-reason-placeholder')}
				class="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
				required
			/>
		</div>
		<div class="flex flex-col">
			<Label for="banExpires" class="text-sm font-medium text-gray-700">
				{$_('admin-pages.users.overview.banExpires')}
			</Label>
			<p class="text-sm text-gray-500">
				{$_('admin-pages.users.overview.ban-expires-description')}
			</p>
			<Tabs.Root class="mt-2" bind:value={banExpiryType}>
				<Tabs.List>
					<Tabs.Trigger value="permanent"
						>{$_('admin-pages.users.overview.permanentBan')}</Tabs.Trigger
					>
					<Tabs.Trigger value="temporary"
						>{$_('admin-pages.users.overview.temporaryBan')}</Tabs.Trigger
					>
				</Tabs.List>
				<Tabs.Content value="temporary">
					<div class="flex flex-row gap-2 items-center">
						<div
							class="flex items-center border border-border rounded-md overflow-hidden focus-within:outline-transparent focus-within:ring-1 focus-within:ring-gray-900 dark:focus-within:ring-gray-50"
						>
							<Button
								variant="ghost"
								size="icon"
								class="size-10"
								disabled={temporaryBanDuration <= 1}
								onclick={decreaseBanDuration}
							>
								<Minus class="size-5" />
							</Button>
							<Input
								type="number"
								class="px-3 py-2 text-center w-10 border-none focus-visible:outline-transparent focus-visible:ring-transparent"
								bind:value={temporaryBanDuration}
							></Input>
							<Button
								variant="ghost"
								size="icon"
								class="size-10"
								disabled={temporaryBanDuration >= 10}
								onclick={increaseBanDuration}
							>
								<Plus class="size-5" />
							</Button>
						</div>
						<Tabs.Root bind:value={temporaryBanDurationType}>
							<Tabs.List>
								<Tabs.Trigger value="hours">{$_('admin-pages.users.overview.hours')}</Tabs.Trigger>
								<Tabs.Trigger value="days">{$_('admin-pages.users.overview.days')}</Tabs.Trigger>
								<Tabs.Trigger value="months">{$_('admin-pages.users.overview.months')}</Tabs.Trigger
								>
								<Tabs.Trigger value="years">{$_('admin-pages.users.overview.years')}</Tabs.Trigger>
							</Tabs.List>
						</Tabs.Root>
					</div>
				</Tabs.Content>
			</Tabs.Root>
		</div>
		<Button type="submit" variant="destructive" class="w-full">
			{$_('admin-pages.users.overview.banUser')}
		</Button>
	</div>
</form>
