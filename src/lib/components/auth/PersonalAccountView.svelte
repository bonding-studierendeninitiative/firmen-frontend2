<script lang="ts">
	import { cn } from '@/utils';
	import { Button } from '@/components/ui/button';
	import * as Card from '@/components/ui/card';
	import { Badge } from '@/components/ui/badge';
	import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
	import { User, Settings, Mail } from '@lucide/svelte';

	interface AUser {
		id: string;
		name: string;
		email: string;
		image?: string;
		role?: string;
	}

	interface Props {
		className?: string;
		classNames?: {
			base?: string;
			header?: string;
			content?: string;
		};
		localization?: any;
		user?: AUser;
		onEditProfile?: () => void;
		onManageAccount?: () => void;
	}

	let {
		className = '',
		classNames = {},
		localization = {},
		user,
		onEditProfile,
		onManageAccount
	}: Props = $props();

	function getInitials(name: string) {
		return name
			.split(' ')
			.map((word) => word.charAt(0))
			.join('')
			.toUpperCase()
			.slice(0, 2);
	}
</script>

<Card.Root class={cn('w-full', className, classNames?.base)}>
	<Card.Header class={classNames?.header}>
		<div class="flex items-center justify-between">
			<div class="space-y-1">
				<Card.Title class="flex items-center gap-2">
					<User class="size-5" />
					{localization.PERSONAL_ACCOUNT || 'Personal Account'}
				</Card.Title>
				<Card.Description>
					{localization.PERSONAL_ACCOUNT_DESCRIPTION || 'Manage your personal profile and settings'}
				</Card.Description>
			</div>
			{#if onManageAccount}
				<Button size="sm" variant="outline" onclick={onManageAccount}>
					<Settings class="mr-2 size-4" />
					{localization.MANAGE || 'Manage'}
				</Button>
			{/if}
		</div>
	</Card.Header>

	<Card.Content class={cn('space-y-6', classNames?.content)}>
		{#if user}
			<!-- User profile section -->
			<div class="flex items-start gap-4">
				<Avatar class="size-16">
					<AvatarImage src={user.image} alt={user.name} />
					<AvatarFallback class="text-lg">
						{getInitials(user.name)}
					</AvatarFallback>
				</Avatar>

				<div class="flex-1 space-y-3">
					<div class="space-y-1">
						<div class="flex items-center gap-2">
							<h3 class="font-semibold text-lg">{user.name}</h3>
							{#if user.role}
								<Badge variant="secondary">
									{user.role}
								</Badge>
							{/if}
						</div>
						<div class="flex items-center gap-2 text-muted-foreground">
							<Mail class="size-4" />
							<span class="text-sm">{user.email}</span>
						</div>
					</div>

					{#if onEditProfile}
						<Button size="sm" variant="outline" onclick={onEditProfile}>
							{localization.EDIT_PROFILE || 'Edit profile'}
						</Button>
					{/if}
				</div>
			</div>

			<!-- Account info -->
			<div class="space-y-4">
				<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
					<div class="space-y-2">
						<h4 class="font-medium text-sm">
							{localization.ACCOUNT_TYPE || 'Account Type'}
						</h4>
						<div class="flex items-center gap-2">
							<Badge variant="outline">
								{localization.PERSONAL || 'Personal'}
							</Badge>
						</div>
					</div>

					<div class="space-y-2">
						<h4 class="font-medium text-sm">
							{localization.MEMBER_SINCE || 'Member Since'}
						</h4>
						<p class="text-sm text-muted-foreground">
							{localization.MEMBER_SINCE_DATE || 'January 2024'}
						</p>
					</div>
				</div>
			</div>
		{:else}
			<!-- Loading or empty state -->
			<div class="flex items-center gap-4">
				<div class="size-16 rounded-full bg-muted animate-pulse"></div>
				<div class="flex-1 space-y-2">
					<div class="h-6 bg-muted rounded animate-pulse"></div>
					<div class="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
				</div>
			</div>
		{/if}
	</Card.Content>
</Card.Root>
