<script lang="ts">
	import { Sidebar, SidebarItem } from '@/@svelte/modules';
	import { OrganizationSwitcher } from 'svelte-clerk/components';
	import { USER_SIDEBAR_LINKS } from '@constant';
	import { page } from '$app/stores';
	import { LoaderCircle } from 'lucide-svelte';

	$: activeUrl = $page.url.pathname;
	export let data;
</script>

<div class=" lg:flex w-full">
	<Sidebar>
		{#await data.organization}
			<LoaderCircle class="w-10 h-10 mx-auto animate-spin text-white" />
		{:then organization}
			<OrganizationSwitcher appearance={
			{elements: {
				organizationSwitcherTrigger: 'text-white hover:text-white/80',
				rootBox: 'ml-[0.45em]'
			}}
			} afterSelectOrganizationUrl={(organization) => {
				return `/${organization.slug}/dashboard`;
			}} hidePersonal={true} />

			<div>
				{#each USER_SIDEBAR_LINKS as { label, route, Icon } }
					<SidebarItem href={`/${organization.slug}${route}`} {label} icon={Icon} active={activeUrl.includes(route)} />
				{/each}
			</div>
		{:catch error}
			<p>Error occured {error}</p>
		{/await}
	</Sidebar>

	<div class="h-[100dvh] w-full overflow-y-scroll">
		<div class="w-full px-16 py-22 bg-white">
			<slot />
		</div>
	</div>
</div>
