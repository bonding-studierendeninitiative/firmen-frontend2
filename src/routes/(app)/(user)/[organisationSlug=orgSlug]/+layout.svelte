<script lang="ts">
	import { Sidebar } from '$lib/@svelte/modules';
	import { Select } from '$lib/@svelte/components';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentOrganization } from '$lib/stores/organizationStore';

	export let data: PageData;
	const orgs = data.orgs;
	const items = orgs?.map((org) => ({ value: org.organizationSlug, name: org.organizationName }));

	onMount(() => {
		const orgSlug = data.organization?.slug;
		currentOrganization.set(orgs?.find(org => org.organizationSlug === orgSlug));
	});

	function switchOrganization(e) {
		if (e.target?.value) {
			currentOrganization.set(orgs?.find(org => org.organizationSlug === e.target?.value));
			goto(`/${e.target?.value}/dashboard`);
		}
	}
</script>

<div class=" lg:flex w-full">
	<Sidebar>
		<a class="text-white pb-3 inline-block" href="/organizations">&larr; Meine Organisationen</a>
		{#if orgs && orgs.length > 1}
			<Select
				value={$currentOrganization?.organizationSlug}
				handleInput={switchOrganization}
				placeholder="Organization"
				{items}
			/>
		{:else}
			<a
				class={`animate-pulse font-extrabold relative px-4 py-3 flex justify-center items-center space-x-4 rounded-lg text-brand bg-white`}
				href="/create-organization">Create Org now</a>
		{/if}
	</Sidebar>

	<div class="h-[100dvh] w-full overflow-y-scroll">
		<div class="w-full px-16 py-22 bg-white">
			<slot />
		</div>
	</div>
</div>
