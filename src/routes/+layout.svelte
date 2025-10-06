<script lang="ts">
	import { onMount, type Snippet } from 'svelte';
	import { Toaster, type ToastOptions } from 'svelte-sonner';
	import '../app.css';
	import { setupI18n, isLocaleLoading, dir } from '@services';

	import { blur } from 'svelte/transition';
	import { RenderScan } from 'svelte-render-scan';
	import { PUBLIC_APP_ENVIRONMENT } from '$env/static/public';
	interface Props {
		children: Snippet;
	}

	let { children }: Props = $props();

	onMount(() => {
		document.dir = $dir;
		setupI18n();
	});
	const toastOptions: ToastOptions = {
		duration: 5000,
		class: 'mr-7 mb-16'
	};
</script>

<RenderScan initialEnabled={PUBLIC_APP_ENVIRONMENT === 'development'} />

{#if $isLocaleLoading}
	<div class="flex justify-center items-center h-screen">
		<div
			class="size-12 rounded-full border-stone-500 border-4 border-t-transparent animate-spin"
		></div>
	</div>
{:else}
	<div in:blur>
		<svelte:boundary
			onerror={(e) => {
				console.error(e);
			}}
		>
			{@render children()}

			{#snippet pending()}
				<p>loading...</p>
			{/snippet}
		</svelte:boundary>
	</div>
{/if}
<Toaster position="bottom-right" {toastOptions} />
