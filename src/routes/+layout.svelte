<script lang="ts">
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import { setupI18n, isLocaleLoaded, dir, init } from '@services';
	import { page } from '$app/stores';
	import { signIn } from '@auth/sveltekit/client';
	import { Button } from '@/components/ui/button';

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
			<Button variant="gradient" on:click={() => signIn('auth0-admin')}>Zum Admin-Dashboard</Button>
		</div>
	{:else}
		<div class="w-full h-full flex items-center justify-center">
			<Button variant="gradient" on:click={() => signIn('auth0')}>Login</Button>
		</div>
	{/if}
{:else}
	<p>Loading...</p>
{/if}
<Toaster containerClassName="mr-7 mb-16" position="bottom-right" {toastOptions} />
