<script>
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import { setupI18n, isLocaleLoaded, locale, dir } from '@services';
	import LanguageSelect from '$lib/@svelte/components/LanguageSelect/LanguageSelect.svelte';

	onMount(() => {
		document.dir = $dir;
		setupI18n({ withLocale: 'de' });
	});
	const toastOptions = {
		duration: 5000
	};
	$: console.log({ locale: $locale });
</script>

{#if $isLocaleLoaded}
	<slot />
	<div class=" right-4 top-2 absolute"><LanguageSelect /></div>
{:else}
	<p>Loading...</p>
{/if}
<Toaster containerClassName="mr-7 mb-16" position="bottom-right" {toastOptions} />
