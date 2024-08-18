<script lang="ts">
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import { setupI18n, isLocaleLoaded, dir, init } from '@services';
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import { GradientButton } from '$lib/@svelte/components';

	onMount(() => {
		document.dir = $dir;
		setupI18n({ withLocale: 'de' });
		init({
			initialLocale: 'de',
			fallbackLocale: 'de'
		})
	});
	const toastOptions = {
		duration: 5000
	};
</script>

{#if $isLocaleLoaded}
	{#if $page.data.session?.user}
		<slot />
	{:else if $page.url.pathname.includes('/admin')}
		<div class="w-full h-full flex items-center justify-center">
			<GradientButton onClick={() => signIn('auth0-admin')}>Admin Login</GradientButton>
		</div>
	{:else}
		<div class="w-full h-full flex items-center justify-center">
			<GradientButton onClick={() => signIn('auth0')}>Login</GradientButton>
		</div>
	{/if}
{:else}
	<p>Loading...</p>
{/if}
<Toaster containerClassName="mr-7 mb-16" position="bottom-right" {toastOptions} />
