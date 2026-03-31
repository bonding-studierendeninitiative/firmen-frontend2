<script lang="ts">
	import { _ } from '@services';
	import * as Sidebar from '@/components/ui/sidebar';
	import * as Icons from '@/@svelte/icons';
	import { cn } from '@/utils';
	import { ADMIN_SIDEBAR_LINKS } from '@constant';
	import { page } from '$app/state';
	import { NavUser } from '@/@svelte/modules';

	let { user }: { user: { name: string; email: string; id: string } } = $props();

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
			<Sidebar.Menu>
				{#each ADMIN_SIDEBAR_LINKS as { label, route, Icon, children }}
					{@const SvelteComponent = Icons[Icon]}
					<Sidebar.MenuItem>
						<Sidebar.MenuButton
							variant="default"
							size="lg"
							class="space-x-3 px-4 hover:bg-sidebar-accent/80"
							isActive={activeUrl.includes(route) && !children?.some(child => activeUrl.includes(child.route))}
						>
							{#snippet child({ props })}
								<a href={route} {...props}>
									<SvelteComponent />
									<span>{$_(`sidebar.${label}`)}</span>
								</a>
							{/snippet}
						</Sidebar.MenuButton>
						{#if children}
							<Sidebar.MenuSub class="mx-5.5 px-5.5">
								{#each children as { label: subLabel, route: subRoute }}
									<Sidebar.MenuSubItem>
										<Sidebar.MenuSubButton
                                            size="md"
                                            isActive={activeUrl.includes(subRoute)}>
											{#snippet child({ props })}
												<a href={subRoute} {...props}>
													<span>{$_(`sidebar.${subLabel}`)}</span>
												</a>
											{/snippet}
										</Sidebar.MenuSubButton>
									</Sidebar.MenuSubItem>
								{/each}
							</Sidebar.MenuSub>
						{/if}
					</Sidebar.MenuItem>
				{/each}
			</Sidebar.Menu>
		</Sidebar.Group>
	</Sidebar.Content>
	<Sidebar.Footer>
		<NavUser {user} />
	</Sidebar.Footer>
</Sidebar.Root>
