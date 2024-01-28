<script>
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	onMount(() => {
		// Redirect to another route when the component is mounted
		goto('/dashboard');
	});
</script>
