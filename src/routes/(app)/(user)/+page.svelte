<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';

	export let data: PageData;

	onMount(() => {
		if (data.memberships && data.memberships.length > 0) {
			goto(`/${data.memberships[0].organizationSlug}/dashboard`);
		} else {
			goto(`/create-org`);
		}
	});
</script>

