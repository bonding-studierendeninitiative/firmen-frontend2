<script lang="ts">
	import type { PageData } from '../../../../../../.svelte-kit/types/src/routes';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	export let data: PageData;

	onMount(() => {
		goto(`/${data.organization?.slug}/dashboard`);
	});
</script>
