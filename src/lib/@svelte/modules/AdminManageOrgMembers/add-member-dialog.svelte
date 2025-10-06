<script lang="ts">
	import * as Dialog from '@/components/ui/dialog';
	import * as Card from '@/components/ui/card';
	import * as Popover from '@/components/ui/popover';
	import * as Command from '@/components/ui/command';
	import * as Avatar from '@/components/ui/avatar';
	import { Check, ChevronsUpDown, LoaderCircle, Plus, Search, User } from '@lucide/svelte';
	import { Button, buttonVariants } from '@/components/ui/button';
	import { _ } from '@services';
	import { Label } from '@/components/ui/label';
	import { tick } from 'svelte';
	import { cn } from '@/utils';
	import { Switch } from '@/components/ui/switch';
	import { getUsers } from '@/trpc/routers/admin';

	interface Props {
		orgId: string;
		onAddMember?: (userId: string, sendNotification: boolean) => void;
	}

	let { onAddMember }: Props = $props();

	let triggerRef = $state<HTMLButtonElement>(null!);

	let userFilters = $state({
		query: '',
		limit: 10,
		page: 0,
		includeMembersCount: false,
		orderBy: '-created_at' as const
	});
	let selectedUser = $state({
		id: '',
		limit: 10,
		page: 0,
		sort: '+created_at' as const
	});

	let open = $state(false);

	let isUsersOpen = $state(false);

	let user:
		| {
				id: string;
				email: string;
				emailVerified: boolean;
				name: string | null;
				createdAt: Date;
				updatedAt: Date;
				image?: string | null | undefined;
				role?: string | null | undefined;
				banReason?: string | null | undefined;
		  }
		| null
		| undefined = $state(null);

	function reset() {
		userFilters.query = '';
		userFilters.limit = 10;
		userFilters.page = 0;
		userFilters.includeMembersCount = false;
		userFilters.orderBy = '-created_at' as const;
		selectedUser.id = '';
		isUsersOpen = false;
		user = null;
		sendNotification = false;
	}

	let sendNotification = $state(false);

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger() {
		isUsersOpen = false;
		tick().then(() => {
			triggerRef?.focus();
		});
	}

	function handleUserSelect(newValue: string) {
		selectedUser.id = newValue;
		user = getUsers(userFilters).current?.data?.find((user) => user.id === newValue) ?? null;

		closeAndFocusTrigger();
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}
		><Plus class="size-4 mr-4" />{$_('modules.add-member-dialog.trigger')}</Dialog.Trigger
	>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$_('modules.add-member-dialog.title')}</Dialog.Title>
			<Dialog.Description>{$_('modules.add-member-dialog.description')}</Dialog.Description>
		</Dialog.Header>
		<Card.Root>
			<Card.Header class="pb-2">
				<Card.Title class="text-lg flex items-center">
					<User class="size-5 mr-2" />
					{$_('modules.add-member-dialog.user-card-header')}
				</Card.Title>
			</Card.Header>
			<Card.Content class="space-y-2 pt-6">
				<div class="flex items-start">
					<Popover.Root bind:open={isUsersOpen}>
						{#snippet children()}
							<Popover.Trigger bind:ref={triggerRef}>
								{#snippet child({ props })}
									<Button
										aria-expanded={isUsersOpen}
										{...props}
										class="w-full justify-between"
										role="combobox"
										variant="outline"
									>
										{user ? user.name : $_('modules.add-member-dialog.select-trigger')}
										<ChevronsUpDown class="ml-2 size-4 shrink-0 opacity-50" />
									</Button>
								{/snippet}
							</Popover.Trigger>
							<Popover.Content class="w-[40ch] p-0">
								<Command.Root shouldFilter={false}>
									<Label class="flex items-center gap-2 py-2">
										<Search class="size-5 ml-2" />
										<input
											bind:value={userFilters.query}
											class="w-full outline-transparent border-transparent py-2"
											placeholder={$_('modules.add-member-dialog.search-users-placeholder')}
										/>
									</Label>
									<Command.Separator />
									{#if getUsers(userFilters).loading}
										<Command.Loading class="flex items-center justify-center py-2">
											<LoaderCircle class="size-6 text-primary animate-spin" />
										</Command.Loading>
									{:else}
										<Command.List>
											{#each getUsers(userFilters).current?.data ?? [] as user}
												<Command.Item
													value={user.id}
													onSelect={() => {
														handleUserSelect(user.id);
													}}
												>
													<Check
														class={cn(
															'mr-2 size-4',
															selectedUser.id !== user.id && 'text-transparent'
														)}
													/>
													{user.name}
												</Command.Item>
											{/each}
										</Command.List>
									{/if}
									<Command.Empty>{$_('modules.add-member-dialog.no-users-found')}</Command.Empty>
								</Command.Root>
							</Popover.Content>
						{/snippet}
					</Popover.Root>
				</div>
				{#if user}
					<div class="flex gap-x-4 p-2">
						<Avatar.Root>
							<Avatar.Image src={user.image} />
							<Avatar.Fallback
								>{user.name
									?.split(' ')
									.slice(0, 2)
									.map((name) => name[0])
									.join('')}</Avatar.Fallback
							>
						</Avatar.Root>
						<div class="space-y-2">
							<p class="text-md font-semibold">{user.name}</p>
							<p class="text-sm">{user.email}</p>
							<div class="flex gap-3 items-center mt-6">
								<Switch id="sendNotification" bind:checked={sendNotification} />
								<Label for="sendNotification">Nutzer:in benachrichtigen</Label>
							</div>
						</div>
					</div>
				{/if}
			</Card.Content>
		</Card.Root>
		<Dialog.Footer class="pt-6">
			<Dialog.Close class={buttonVariants({ variant: 'outline' })}
				>{$_('common.cancel')}</Dialog.Close
			>
			{#if $effect.pending()}
				<Button disabled variant="default">
					<Plus class="mr-2 size-5" />

					<LoaderCircle class="size-3 animate-spin mx-6" />
				</Button>
			{:else}
				<Button
					onclick={async () => {
						onAddMember?.(selectedUser.id, sendNotification);
						open = false;
						reset();
					}}
					variant="default"
				>
					<Plus class="mr-2 size-5" />
					{$_('common.add')}
				</Button>
			{/if}
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
