<script lang="ts">
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import { setupI18n, isLocaleLoading, dir } from '@services';
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import { Button } from '@/components/ui/button';
	import { ColorLogoIcon } from '@/@svelte/icons';
	import { LanguageSelect } from '@/@svelte/components';
	import { _ } from '@services';
	import * as Card from '@/components/ui/card';

	onMount(() => {
		document.dir = $dir;
		setupI18n();
	});
	const toastOptions = {
		duration: 5000
	};


</script>
{#if $isLocaleLoading}
	<div class="flex justify-center items-center h-screen">
		<div class="w-12 h-12 rounded-full border-stone-500 border-4 border-t-transparent animate-spin">
		</div>
	</div>
{:else if $page.data.session?.user}
	<slot />
{:else}
	<div class=" flex w-full h-screen">
		<div class=" w-3/4 flex-row">
			<nav class=" px-10 py-4 border-b border-solid border-stone-200 relative">
				<ColorLogoIcon />
				<div class=" right-4 top-4 absolute">
					<LanguageSelect />
				</div>
			</nav>
			<div class=" flex justify-center items-center h-5/6">
				<Card.Root>
					<Card.Header>
						<Card.Title>{$_('auth.welcomeScreen.welcomeTitle')}</Card.Title>
						<Card.Description>{$_('auth.welcomeScreen.welcomeDescription')}</Card.Description>
					</Card.Header>
					<Card.Content>
						{#if $page.url.pathname.includes('/admin')}
							<div class="w-full h-full flex items-center justify-center">
								<Button on:click={() => signIn('auth0-admin')}>{$_("auth.login.admin-login")}</Button>
							</div>
						{:else}
							<div class="w-full h-full flex items-center justify-center">
								<Button on:click={() => signIn('auth0')}>{$_("auth.login.login")}</Button>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
			<footer class=" px-10 py-4 border-t border-solid border-stone-200 bottom-0 fixed w-3/4">
				<div class=" flex justify-between font-semi-light text-stone-500">
					<p>©2024 bonding-studierendeninitiative e.V.</p>
					<div class="flex justify-between">
						<p class="mr-1"><a href="https://bonding.de/impressum" target="_blank">{$_('auth.footer.imprint')}</a></p>
						<p><a href="https://bonding.de/datenschutz" target="_blank">{$_('auth.footer.privacyPolicy')}</a></p>
					</div>
				</div>
			</footer>
		</div>
		<div
			class=" bg-cover bg-center h-screen w-1/4 rounded-none border-none"
			style="background-image: url('/sidebar_background.png');"
		></div>
	</div>
{/if}
<Toaster containerClassName="mr-7 mb-16" position="bottom-right" {toastOptions} />
