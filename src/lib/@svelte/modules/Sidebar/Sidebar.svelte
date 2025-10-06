<script lang="ts">
	import * as Icons from '$lib/@svelte/icons';
	import { page } from '$app/state';
	import { cn } from '@/utils/ui';
	import { _ } from '@services';
	import { LanguageSelect } from '@/@svelte/components';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	const handleMenuToggler = () => {
		const sidebar = document.getElementById('sidebar');
		sidebar?.classList.toggle('hidden');
		sidebar?.classList.toggle('fixed');
		sidebar?.classList.toggle('lg:block');
	};

	function isAdmin() {
		return page.url.pathname?.includes('admin');
	}

	const getImagePath = (): string => {
		if (isAdmin()) {
			return '/sidebar_background.png';
		} else return '/sidebar_background.png';
	};

	const WhiteLogo = $derived(Icons['WhiteLogoIcon']);
	const Notification = $derived(Icons['NotificationIcon']);
</script>

<div class=" bg-white! lg:flex">
	<nav class="bg-white border-b border-gray-300 lg:hidden">
		<!-- Mobile Navbar -->
		<div class="flex justify-between items-center px-9 py-2">
			<!-- Ícono de Menú -->
			<button
				aria-label={$_('common.menu')}
				id="menu-button"
				class="lg:hidden"
				onclick={handleMenuToggler}
			>
				<i class="fas fa-bars text-brand text-lg"></i>
			</button>
			<!-- Logo -->
			<div class="ml-1">
				<img src="/logo.png" alt="logo" class="h-auto w-18" />
			</div>

			<!-- Ícono de Notificación y Perfil -->
			<div class="space-x-4">
				<button aria-label={$_('common.notifications')}>
					<Notification />
					<i class="fas fa-bell text-cyan-500 text-lg"></i>
				</button>

				<!-- Botón de Perfil -->
				<button aria-label={$_('common.user')}>
					<i class="fas fa-user text-cyan-500 text-lg"></i>
				</button>
			</div>
		</div>
	</nav>

	<div
		id="sidebar"
		class={cn('lg:block hidden bg-cover bg-center h-screen w-84 rounded-none border-none z-10')}
		style={`background-image: url(${getImagePath()});`}
	>
		<!-- Items -->
		<div class="p-6 space-y-4 h-full flex flex-col justify-between">
			<div>
				<WhiteLogo />
				<div class="mt-10! space-y-2">
					{@render children?.()}
				</div>
			</div>
			<div class="flex flex-row justify-between">
				<!--TODO: <UserButton showName={true} appearance={{elements: {
				userButtonTrigger: 'text-white! hover:text-white/80!',
				userButtonBox: 'flex-row-reverse',
			}}} afterSignOutUrl="/" />-->

				<LanguageSelect />
			</div>
		</div>
	</div>
</div>
