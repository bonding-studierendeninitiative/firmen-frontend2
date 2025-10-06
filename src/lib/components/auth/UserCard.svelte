<script lang="ts">
	import { cn } from '@/utils';
	import * as Card from '@/components/ui/card';
	import { Button } from '@/components/ui/button';
	import { Skeleton } from '@/components/ui/skeleton';
	import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
	import { Badge } from '@/components/ui/badge';
	import {
		DropdownMenu,
		DropdownMenuContent,
		DropdownMenuItem,
		DropdownMenuSeparator,
		DropdownMenuTrigger
	} from '@/components/ui/dropdown-menu';
	import {
		Settings,
		LogOut,
		User as UserIcon,
		MoreVertical,
		Shield,
		Crown,
		Users
	} from '@lucide/svelte';

	interface User {
		id: string;
		name: string;
		email: string;
		image?: string;
		emailVerified?: string | null;
		role?: string;
		createdAt: string;
		updatedAt: string;
	}

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			avatar?: string;
			content?: string;
			name?: string;
			email?: string;
			badge?: string;
			skeleton?: string;
		};
		localization?: any;
		user?: User | null;
		showRole?: boolean;
		showActions?: boolean;
		onEditProfile?: () => void;
		onSignOut?: () => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		user = null,
		showRole = false,
		showActions = true,
		onEditProfile,
		onSignOut
	}: Props = $props();

	let isPending = $state(false);

	// Mock user data if none provided
	let displayUser: User = $derived(
		user || {
			id: '1',
			name: 'John Doe',
			email: 'john.doe@example.com',
			image: undefined,
			emailVerified: new Date().toISOString(),
			role: 'member',
			createdAt: new Date().toISOString(),
			updatedAt: new Date().toISOString()
		}
	);

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((n) => n[0])
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}

	function getRoleIcon(role: string) {
		switch (role) {
			case 'owner':
				return Crown;
			case 'admin':
				return Shield;
			case 'member':
				return Users;
			default:
				return UserIcon;
		}
	}

	function getRoleLabel(role: string) {
		const roleLabels = {
			owner: localization.OWNER || 'Owner',
			admin: localization.ADMIN || 'Admin',
			member: localization.MEMBER || 'Member'
		};
		return roleLabels[role as keyof typeof roleLabels] || role;
	}

	function getRoleVariant(role: string) {
		switch (role) {
			case 'owner':
				return 'default';
			case 'admin':
				return 'secondary';
			case 'member':
				return 'outline';
			default:
				return 'outline';
		}
	}

	function handleEditProfile() {
		onEditProfile?.();
	}

	function handleSignOut() {
		onSignOut?.();
	}
</script>

{#if isPending}
	<!-- Loading skeleton -->
	<Card.Root class={cn('w-full max-w-sm', className, classNames?.base)}>
		<Card.Content class="flex items-center space-x-4 p-6">
			<Skeleton class={cn('size-12 rounded-full', classNames?.skeleton)} />
			<div class="flex-1 space-y-2">
				<Skeleton class={cn('h-4 w-32', classNames?.skeleton)} />
				<Skeleton class={cn('h-3 w-48', classNames?.skeleton)} />
				{#if showRole}
					<Skeleton class={cn('h-5 w-16', classNames?.skeleton)} />
				{/if}
			</div>
			{#if showActions}
				<Skeleton class={cn('size-8', classNames?.skeleton)} />
			{/if}
		</Card.Content>
	</Card.Root>
{:else}
	<Card.Root class={cn('w-full max-w-sm', className, classNames?.base)}>
		<Card.Content class={cn('flex items-center space-x-4 p-6', classNames?.content)}>
			<Avatar class={cn('size-12', classNames?.avatar)}>
				<AvatarImage src={displayUser.image} alt={displayUser.name} />
				<AvatarFallback>
					{getInitials(displayUser.name)}
				</AvatarFallback>
			</Avatar>

			<div class="min-w-0 flex-1">
				<div class="flex items-center gap-2">
					<p class={cn('font-medium text-sm truncate', classNames?.name)}>
						{displayUser.name}
					</p>
					{#if !displayUser.emailVerified}
						<Badge variant="destructive" class="text-xs">
							{localization.UNVERIFIED || 'Unverified'}
						</Badge>
					{/if}
				</div>

				<p class={cn('text-muted-foreground text-xs truncate', classNames?.email)}>
					{displayUser.email}
				</p>

				{#if showRole && displayUser.role}
					<div class="mt-2">
						<Badge
							variant={getRoleVariant(displayUser.role)}
							class={cn('text-xs', classNames?.badge)}
						>
							{#if getRoleIcon(displayUser.role)}
								{@const RoleIcon = getRoleIcon(displayUser.role)}
								<RoleIcon class="mr-1 size-3" />
							{/if}
							{getRoleLabel(displayUser.role)}
						</Badge>
					</div>
				{/if}
			</div>

			{#if showActions}
				<DropdownMenu>
					<DropdownMenuTrigger>
						{#snippet child(props)}
							<Button {...props} variant="ghost" size="sm" class="size-8 p-0">
								<MoreVertical class="size-4" />
								<span class="sr-only">{localization.OPEN_MENU || 'Open menu'}</span>
							</Button>
						{/snippet}
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onclick={handleEditProfile}>
							<Settings class="mr-2 size-4" />
							{localization.EDIT_PROFILE || 'Edit Profile'}
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onclick={handleSignOut} class="text-destructive">
							<LogOut class="mr-2 size-4" />
							{localization.SIGN_OUT || 'Sign Out'}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			{/if}
		</Card.Content>
	</Card.Root>
{/if}
