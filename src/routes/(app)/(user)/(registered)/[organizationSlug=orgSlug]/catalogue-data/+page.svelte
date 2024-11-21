<script lang="ts">

	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { currentOrganizationSlugStore } from '@/stores/currentOrganizationSlugStore';

	onMount(() => {
		goto(`/${$currentOrganizationSlugStore?.organizationSlug}/catalogue-data/portraits`);
	});
</script>