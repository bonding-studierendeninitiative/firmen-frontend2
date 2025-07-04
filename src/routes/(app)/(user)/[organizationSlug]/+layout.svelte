<script lang="ts">
	import { Sidebar, SidebarItem } from '@/@svelte/modules';
	import { OrganizationSwitcher } from 'svelte-clerk';
	import { USER_SIDEBAR_LINKS } from '@constant';
	import { page } from '$app/state';
	import { LoaderCircle } from '@lucide/svelte';

	let activeUrl = $derived(page.url.pathname);
	let { data, children } = $props();

	type Org = {slug: string | null}

	function getOrgUrl(organization: Org): string {
		return`/${organization.slug}/dashboard`
	}
</script>

<div class=" lg:flex w-full">
	<Sidebar>
		{#await data.organization}
			<LoaderCircle class="size-10 mx-auto animate-spin text-white" />
		{:then organization}
			<OrganizationSwitcher
				createOrganizationMode="navigation"
				createOrganizationUrl="/create-org/"
				skipInvitationScreen={true}
				appearance={{
					elements: {
						organizationSwitcherTrigger: 'text-white! hover:text-white/80!',
						rootBox: 'ml-[0.45em]',
						formButtonReset: "bg-primary!"
					}
				}}
				afterSelectOrganizationUrl={getOrgUrl}
				hidePersonal={true}
			/>

			<div>
				{#each USER_SIDEBAR_LINKS as { label, route, Icon }}
					<SidebarItem
						href={`/${organization.slug}${route}`}
						{label}
						icon={Icon}
						active={activeUrl.includes(route)}
					/>
				{/each}
			</div>
		{:catch error}
			<p>Error occured {error}</p>
		{/await}
	</Sidebar>

	<div class="h-dvh w-full overflow-y-scroll">
		<div class="w-full px-16 py-22 bg-white">
			{@render children?.()}
		</div>
	</div>
</div>
