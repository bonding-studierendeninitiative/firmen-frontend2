<script lang="ts">
	import { USER_SIDEBAR_LINKS } from '$lib/constants';
	import * as Icons from '$lib/@svelte/icons';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	$: activeUrl = $page.url.pathname;

	const checkCurrentPath = (route: string, currentRoute: string) => {
		return currentRoute.includes(route);
	};
	const handleMenuToggler = () => {
		var sidebar = document.getElementById('sidebar');
		sidebar?.classList.toggle('hidden');
		sidebar?.classList.toggle('lg:block');
	};

	const handleLogoutClick = () => {
		goto('/access-preference');
	};
</script>

<html lang="de">
	<head>
		<meta charset="UTF-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<title>Bonding</title>
		<link
			rel="stylesheet"
			href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta2/css/all.min.css"
		/>
	</head>
	<body class="!bg-white lg:flex">
		<nav class="bg-white border-b border-gray-300 lg:hidden">
			<div class="flex justify-between items-center px-9 py-2">
				<!-- Ícono de Menú -->
				<button id="menu-button" class="lg:hidden" on:click={handleMenuToggler}>
					<i class="fas fa-bars text-brand text-lg"></i>
				</button>
				<!-- Logo -->
				<div class="ml-1">
					<img src="logo.png" alt="logo" class="h-4 w-18" />
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

		<!-- Barra lateral -->
		<div
			id="sidebar"
			class="lg:block hidden bg-cover bg-center h-screen w-84 rounded-none border-none"
			style="background-image: url('sidebar_background.png');"
		>
			<!-- Items -->
			<div class="p-6 space-y-4 h-full flex flex-col justify-between">
				<div>
					<svelte:component this={Icons['WhiteLogoIcon']} />
					<div class="!mt-10">
						{#each USER_SIDEBAR_LINKS as { label, Icon, route } (label)}
							<a
								href={route}
								aria-label={label}
								class={`relative px-4 py-3 flex items-center space-x-4 rounded-lg text-white ${checkCurrentPath(route, activeUrl) ? 'bg-brand' : ''}`}
							>
								<svelte:component this={Icons[Icon]} />
								<span class="-mr-1 font-medium">{label}</span>
							</a>
						{/each}
					</div>
				</div>
				<button
					class="px-4 py-3 flex items-center space-x-4 rounded-md text-white group"
					on:click={handleLogoutClick}
				>
					<svelte:component this={Icons['LogoutIcon']} />
					<span>Logout</span>
				</button>
			</div>
		</div>
	</body>
</html>
