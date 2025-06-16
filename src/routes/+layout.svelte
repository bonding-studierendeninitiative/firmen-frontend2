<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { Toaster } from 'svelte-sonner';
	import '../app.css';
	import { setupI18n, isLocaleLoading, dir, locale } from '@services';
	import { ClerkProvider } from 'svelte-clerk';
	import { deDE, enUS } from '@clerk/localizations';
	import { PUBLIC_CLERK_PUBLISHABLE_KEY } from '$env/static/public';
	import { blur } from 'svelte/transition';
	import { browser } from '$app/environment';
	import { QueryClient, QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { RenderScan } from 'svelte-render-scan';
	import {PUBLIC_APP_ENVIRONMENT} from "$env/static/public";
	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				enabled: browser,
				staleTime: 1000 * 60// * 60 * 24 * 7,
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

<RenderScan initialEnabled={PUBLIC_APP_ENVIRONMENT === "developement"} />

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
				{@render children()}
			</ClerkProvider>
		</QueryClientProvider>
	</div>
{/if}
<Toaster containerClassName="mr-7 mb-16" position="bottom-right" {toastOptions} />
