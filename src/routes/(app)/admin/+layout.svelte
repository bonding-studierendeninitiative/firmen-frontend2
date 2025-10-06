<script lang="ts">
	import { AdminJobs, Sidebar, SidebarItem } from '@/@svelte/modules';
	import { ADMIN_SIDEBAR_LINKS } from '@constant';
	import { page } from '$app/state';

	let activeUrl = $derived(page.url.pathname);

	let { children } = $props();
</script>

<div class=" lg:flex w-full">
	<Sidebar>
		<div>
			{#each ADMIN_SIDEBAR_LINKS as { label, route, Icon }}
				<SidebarItem href={route} {label} icon={Icon} active={activeUrl.includes(route)} />
			{/each}
		</div>
	</Sidebar>

	<div class="h-dvh w-full grow overflow-y-scroll bg-muted">
		<AdminJobs />
		<div class="w-full px-16 py-22">
			{@render children?.()}
		</div>
	</div>
</div>
