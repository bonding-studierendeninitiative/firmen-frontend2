<script lang="ts">
	import { Sidebar, SidebarItem } from '@/@svelte/modules';
	import { OrganizationSwitcher } from 'svelte-clerk';
	import { USER_SIDEBAR_LINKS } from '@constant';
	import { page } from '$app/state';

	let activeUrl = $derived(page.url.pathname);
	let { data, children } = $props();

	type Org = {slug: string | null}

	function getOrgUrl(organization: Org): string {
		return`/${organization.slug}/dashboard`
	}
</script>

<div class=" lg:flex w-full">
	<Sidebar>
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
						href={`/${data.organization.slug}${route}`}
						{label}
						icon={Icon}
						active={activeUrl.includes(route)}
					/>
				{/each}
			</div>
	</Sidebar>

	<div class="h-dvh w-full overflow-y-scroll @container">
		<div class="w-full p-6 @xl:px-16 @xl:py-22 bg-white">
			{@render children?.()}
		</div>
	</div>
</div>
