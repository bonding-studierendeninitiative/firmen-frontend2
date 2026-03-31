<script lang="ts">
	import * as Icons from '$lib/@svelte/icons';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import { OrganizationSwitcher } from '@/components/organization';
	import { cn } from '@/utils';
	import { _ } from '@services';
	import { USER_SIDEBAR_LINKS } from '@constant';
	import { page } from '$app/state';
	import { NavUser } from '@/@svelte/modules';

	let { user, organization }: { user: { name: string; email: string; id: string }, organization: { slug: string } } = $props();

	let WhiteLogo = $derived(Icons['WhiteLogoIcon']);

	let activeUrl = $derived(page.url.pathname);
</script>

<Sidebar.Root
	collapsible="icon"
	class={cn('bg-inherit bg-cover bg-center bg-(image:--sidebar) p-6')}
>
	<Sidebar.Header>
		<WhiteLogo />
	</Sidebar.Header>

	<Sidebar.Content>
		<Sidebar.Group>
			<OrganizationSwitcher className="text-foreground" />
		</Sidebar.Group>
		<Sidebar.Group>
			<Sidebar.Menu>
				{#each USER_SIDEBAR_LINKS as { label, route, Icon }}
					{@const SvelteComponent = Icons[Icon]}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							variant="default"
							size="lg"
							class="space-x-3 px-4 hover:bg-sidebar-accent/80"
							isActive={activeUrl.includes(route)}
						>
							{#snippet child({ props })}
								<a href={`/${organization.slug}${route}`} {...props}>
									<SvelteComponent />
									<span>{$_(`sidebar.${label}`)}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
