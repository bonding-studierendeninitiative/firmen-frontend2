<script lang="ts">
	import { LogOut, EllipsisVertical, Globe } from '@lucide/svelte';
	import { _, locale } from '@services';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import * as Sidebar from '@/components/ui/sidebar';
	import authClient from '@/auth-client';
	import { goto } from '$app/navigation';
	let { user }: { user: { name: string; email: string; id: string } } = $props();
	const sidebar = Sidebar.useSidebar();
</script>

<Sidebar.Menu>
	<Sidebar.MenuItem>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				{#snippet child({ props })}
					<Sidebar.MenuButton
						{...props}
						size="lg"
						variant="outline"
						class="text-foreground data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
					>
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={`/api/avatar/${user.id}.svg`} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="text-muted-foreground truncate text-xs">
								{user.email}
							</span>
						</div>
						<EllipsisVertical class="ml-auto size-4" />
					</Sidebar.MenuButton>
				{/snippet}
			</DropdownMenu.Trigger>
			<DropdownMenu.Content
				class="w-(--bits-dropdown-menu-anchor-width) min-w-56 rounded-lg"
				side={sidebar.isMobile ? 'bottom' : 'right'}
				align="end"
				sideOffset={4}
			>
				<DropdownMenu.Label class="p-0 font-normal">
					<div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
						<Avatar.Root class="size-8 rounded-lg">
							<Avatar.Image src={`/api/avatar/${user.id}.svg`} alt={user.name} />
							<Avatar.Fallback class="rounded-lg">CN</Avatar.Fallback>
						</Avatar.Root>
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-medium">{user.name}</span>
							<span class="text-muted-foreground truncate text-xs">
								{user.email}
							</span>
						</div>
					</div>
				</DropdownMenu.Label>
				<DropdownMenu.Item></DropdownMenu.Item>
				<DropdownMenu.Sub>
					<DropdownMenu.SubTrigger
						><Globe />
						{$_('user-pages.user-nav.language-selection', {
							values: {
								lang: $locale
							}
						})}</DropdownMenu.SubTrigger
					>
					<DropdownMenu.SubContent>
						<DropdownMenu.Item onclick={() => locale.set('de')}>DE</DropdownMenu.Item>
						<DropdownMenu.Item onclick={() => locale.set('en')}>EN</DropdownMenu.Item>
					</DropdownMenu.SubContent>
				</DropdownMenu.Sub>
				<DropdownMenu.Separator />
				<DropdownMenu.Item
					onclick={async () => {
						await authClient.signOut();
						await goto('/');
					}}
				>
					<LogOut />
					{$_('user-pages.user-nav.sign-out')}
				</DropdownMenu.Item>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</Sidebar.MenuItem>
</Sidebar.Menu>
