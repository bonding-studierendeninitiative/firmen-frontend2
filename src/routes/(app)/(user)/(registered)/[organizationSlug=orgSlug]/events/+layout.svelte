<script>
	import { Spinner } from 'flowbite-svelte';
	import { navigating } from '$app/stores';
	import { fade } from 'svelte/transition';
</script>

{#if $navigating?.to?.url.pathname.includes('/events')}
	<div class="grid justify-center items-center h-full text-orange-400">
		<Spinner color="red" />
	</div>
{:else}
	<div in:fade>
		<slot />
	</div>
{/if}
