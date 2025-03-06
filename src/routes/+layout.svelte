<script lang="ts">
	import { onMount } from 'svelte';
	import { Toaster } from 'svelte-french-toast';
	import '../app.css';
	import { setupI18n, isLocaleLoading, dir, locale } from '@services';
	import { page } from '$app/stores';
	import SuperDebug from 'sveltekit-superforms';
	import { ClerkProvider } from 'svelte-clerk';
	import { deDE, enUS } from '@clerk/localizations';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';

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
{:else}
	<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY} localization={$locale === 'de' ? deDE : enUS}>
			<slot />
	</ClerkProvider>
	<SuperDebug data={page} />
{/if}
<Toaster containerClassName="mr-7 mb-16" position="bottom-right" {toastOptions} />
