<!-- @migration-task Error while migrating Svelte code: `$:` is not allowed in runes mode, use `$derived` or `$effect` instead
https://svelte.dev/e/legacy_reactive_statement_invalid -->
<script lang="ts">
	import { cn } from '@/utils';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import * as DropdownMenu from '@/components/ui/dropdown-menu';
	import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
	import { EllipsisIcon, UserCogIcon, UserXIcon } from '@lucide/svelte';

	interface Member {
		id: string;
		role: string;
		createdAt: string;
		user: {
			id: string;
			name?: string;
			email?: string;
			image?: string;
		};
	}

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			cell?: string;
			button?: string;
			icon?: string;
		};
		member: Member;
		localization?: any;
		hideActions?: boolean;
	}

	let {
		className = '',
		classNames = {},
		member,
		localization = {},
		hideActions = false
	}: Props = $props();

	let removeDialogOpen = $state(false);
	let updateRoleDialogOpen = $state(false);

	// Mock role labels - would come from context in real implementation
	const builtInRoles = [
		{ role: 'owner', label: localization.OWNER || 'Owner' },
		{ role: 'admin', label: localization.ADMIN || 'Admin' },
		{ role: 'member', label: localization.MEMBER || 'Member' }
	];

	let roleLabel = $state('');
	let initials = $state('U'); // Default initials if user name is not available

	let isProcessing = $derived(removeDialogOpen || updateRoleDialogOpen);

	$effect(() => {
		if (!member || !member.user) {
			console.warn('Member or user data is missing');
			return;
		}
		roleLabel = builtInRoles.find((r) => r.role === member.role)?.label || member.role;
		initials =
			member.user.name
				?.split(' ')
				.map((n) => n[0])
				.join('')
				.toUpperCase() || 'U';
	});
</script>

<Card.Root class={cn('flex-row items-center p-4', className, classNames?.cell)}>
	<div class="flex min-w-0 flex-1 items-center gap-3">
		<Avatar class="size-8">
			{#if member.user.image}
				<AvatarImage src={member.user.image} alt={member.user.name || ''} />
			{/if}
			<AvatarFallback>{initials}</AvatarFallback>
		</Avatar>

		<div class="min-w-0 flex-1">
			<div class="flex items-center gap-2">
				<p class="font-medium text-sm truncate">
					{member.user.name || member.user.email || 'Unknown User'}
				</p>
				<span class="inline-flex items-center rounded-full bg-muted px-2 py-1 text-xs font-medium">
					{roleLabel}
				</span>
			</div>
			{#if member.user.email && member.user.name}
				<p class="text-muted-foreground text-xs truncate">
					{member.user.email}
				</p>
			{/if}
		</div>
	</div>

	{#if !hideActions}
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child(props)}
					<Button {...props} variant="outline">
						{#if isProcessing}
							<Loader2 class="size-4 animate-spin" />
						{:else}
							<EllipsisIcon class="size-4" />
						{/if}
					</Button>
				{/snippet}
			</DropdownMenu.Trigger>

			<DropdownMenu.Content>
				<DropdownMenu.Item onclick={() => (updateRoleDialogOpen = true)}>
					<UserCogIcon class={cn('size-4', classNames?.icon)} />
					{localization?.UPDATE_ROLE || 'Update Role'}
				</DropdownMenu.Item>

				<DropdownMenu.Item onclick={() => (removeDialogOpen = true)} class="text-destructive">
					<UserXIcon class={cn('size-4', classNames?.icon)} />
					{localization?.REMOVE_MEMBER || 'Remove Member'}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	{/if}
</Card.Root>

<!-- TODO: Implement these dialogs -->
{#if removeDialogOpen}
	<!-- RemoveMemberDialog would go here -->
{/if}

{#if updateRoleDialogOpen}
	<!-- UpdateMemberRoleDialog would go here -->
{/if}
