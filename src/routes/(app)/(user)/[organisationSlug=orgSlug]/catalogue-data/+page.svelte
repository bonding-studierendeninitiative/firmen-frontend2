<script lang="ts">

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentOrganization } from '$lib/stores/organizationStore';

	onMount(() => {
		goto(`/${$currentOrganization?.organizationSlug}/catalogue-data/portraits`);
	});
</script>