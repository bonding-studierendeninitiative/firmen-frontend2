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
	import { blur } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser
			}
		}
	});
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
	<div in:blur>
		<QueryClientProvider client={queryClient}>
			<SvelteQueryDevtools />
			<ClerkProvider publishableKey={PUBLIC_CLERK_PUBLISHABLE_KEY} localization={$locale === 'de' ? deDE : enUS}>
				<slot />
			</ClerkProvider>
		</QueryClientProvider>
		<SuperDebug data={page} />
	</div>
{/if}
<Toaster containerClassName="mr-7 mb-16" position="bottom-right" {toastOptions} />
