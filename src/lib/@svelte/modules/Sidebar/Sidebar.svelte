<script lang="ts">
	import { ADMIN_SIDEBAR_LINKS, USER_SIDEBAR_LINKS, type SidebarLinkTypes } from '$lib/constants';
	import * as Icons from '$lib/@svelte/icons';
	import { page } from '$app/stores';
	import { _ } from '@services';
	import { signOut } from '@auth/sveltekit/client';
	import { currentOrganization } from '$lib/stores/organizationStore';
	import { cn } from '@/utils';

	$: activeUrl = $page.url.pathname;

	const checkCurrentPath = (route: string, currentRoute: string) => {
		return currentRoute.includes(route);
	};
	const handleMenuToggler = () => {
		const sidebar = document.getElementById('sidebar');
		sidebar?.classList.toggle('hidden');
		sidebar?.classList.toggle('fixed');
		sidebar?.classList.toggle('lg:block');
	};

	const getSidebarData = (): SidebarLinkTypes[] => {
		if (isAdmin()) {
			return ADMIN_SIDEBAR_LINKS;
		} else return USER_SIDEBAR_LINKS;
	};

	function isAdmin() {
		return $page.url.pathname?.includes('admin');
	}

	const getImagePath = (): string => {
		if (isAdmin()) {
			return '/sidebar_background.png';
		} else return '/sidebar_background.png';
	};
	const getSidebarLink = ({ route }: { route: string }): string => {
		if (isAdmin()) {
			return route;
		} else return `/${$currentOrganization?.organizationSlug}${route}`;
	};
</script>

<div class=" !bg-white lg:flex">
	<nav class="bg-white border-b border-gray-300 lg:hidden">
		<!-- Mobile Navbar -->
		<div class="flex justify-between items-center px-9 py-2">
			<!-- Ícono de Menú -->
			<button id="menu-button" class="lg:hidden" on:click={handleMenuToggler}>
				<i class="fas fa-bars text-brand text-lg"></i>
			</button>
			<!-- Logo -->
			<div class="ml-1">
				<img src="/logo.png" alt="logo" class="h-4 w-18" />
			</div>

			<!-- Ícono de Notificación y Perfil -->
			<div class="space-x-4">
				<button>
					<i class="fas fa-bell text-cyan-500 text-lg"></i>
				</button>

				<!-- Botón de Perfil -->
				<button>
					<i class="fas fa-user text-cyan-500 text-lg"></i>
				</button>
			</div>
		</div>
	</nav>

	<div
		id="sidebar"
		class={cn("lg:block hidden bg-cover bg-center h-screen w-84 rounded-none border-none z-10",isAdmin() && "grayscale")}
		style={`background-image: url(${getImagePath()});`}
	>
		<!-- Items -->
		<div class="p-6 space-y-4 h-full flex flex-col justify-between">
			<div>
				<svelte:component this={Icons['WhiteLogoIcon']} />
				<div class="!mt-5">
					<slot />
				</div>
				<div class="!mt-5">
					{#each getSidebarData() as { label, Icon, route } (label)}
						<a
							href={getSidebarLink({ route })}
							aria-label={label}
							class={`relative px-4 py-3 flex items-center space-x-4 rounded-lg text-white ${checkCurrentPath(getSidebarLink({ route }), activeUrl) ? 'bg-brand' : ''}`}
						>
							<svelte:component this={Icons[Icon]} />
							<span class="-mr-1 font-medium">{$_(`sidebar.${label}`)}</span>
						</a>
					{/each}
				</div>
			</div>
			<button
				on:click|preventDefault={() => signOut()}
				class="px-4 py-3 flex items-center space-x-4 rounded-md text-white group"
			>
				<svelte:component this={Icons['LogoutIcon']} />
				<span>{$_(`sidebar.logout`)}</span>
			</button>
		</div>
	</div>
</div>
