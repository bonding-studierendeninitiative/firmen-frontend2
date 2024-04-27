<script>
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import { setupI18n, isLocaleLoaded, locale, dir } from '@services';

	onMount(() => {
		document.dir = $dir;
		setupI18n({ withLocale: 'en' });
	});
	const toastOptions = {
		duration: 5000
	};
</script>

{#if $isLocaleLoaded}
	<slot />
{:else}
	<p>Loading...</p>
{/if}
<Toaster containerClassName="mr-7 mb-16" position="bottom-right" {toastOptions} />
