<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import type { PageData } from './$types';
	import { CreateOrganization } from '$lib/@svelte/modules/CreateOrganization';

	export let data: PageData;
	let isOpen = false;
	onMount(() => {
		if (data.memberships && data.memberships.length > 0) {
			goto(`/${data.memberships[0].organizationSlug}/dashboard`);
		} else {
			isOpen = true;
		}
	});
</script>

<CreateOrganization bind:isOpen validated={data.form} />
