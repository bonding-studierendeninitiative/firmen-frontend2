<script>
	import { onMount } from 'svelte';
	import '../app.css';
	import { setupI18n, isLocaleLoaded, locale, dir } from '../services/i18n';

	onMount(() => {
		document.dir = $dir;
		setupI18n({ withLocale: 'en' });
	});
</script>

{#if $isLocaleLoaded}
	<slot />
{:else}
	<p>Loading...</p>
{/if}
