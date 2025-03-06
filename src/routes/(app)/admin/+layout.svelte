<script lang="ts">
	import { Sidebar, SidebarItem } from '@/@svelte/modules';
	import { ADMIN_SIDEBAR_LINKS } from '@constant';
	import { page } from '$app/stores';

	$: activeUrl = $page.url.pathname;
</script>

<div class=" lg:flex w-full">
	<Sidebar>
		<div>
			{#each ADMIN_SIDEBAR_LINKS as { label, route, Icon } }
				<SidebarItem href={route} {label} icon={Icon} active={activeUrl.includes(route)} />
			{/each}
		</div>
	</Sidebar>

	<div class="h-[100dvh] w-full flex-grow overflow-y-scroll">
		<div class="w-full px-16 py-22 bg-white">
			<slot />
		</div>
	</div>
</div>
