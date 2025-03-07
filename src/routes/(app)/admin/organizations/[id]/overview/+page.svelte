<script lang="ts">
	import { _ } from '@services';
	import type { CreateOrgInviteRequest, GetOrgMembersResponse } from '@schema';
	import SuperDebug, { type SuperValidated } from 'sveltekit-superforms';
	import type { InferOutput } from 'valibot';
	import { getContext } from 'svelte';
	import type { ReadOrWritable } from 'svelte-headless-table';
	import { ManageOrgMembers } from '@/@svelte/modules';
	import type { OrganizationMembership } from 'svelte-clerk/server';
	import { LoaderCircle } from 'lucide-svelte';


	export let data;

	function filterOrgEntries(tuple: [string, any]): tuple is [string, string] {
		const [key, value] = tuple;
		const excludedKeys = ['id', 'createdAt', 'modifiedAt', 'slug', 'name', 'organizationType', "imageUrl"];
		const keyValid = key != undefined && !excludedKeys.includes(key);
		const valueValid = typeof value === 'string';
		return keyValid && valueValid;
	}
</script>

<section class="space-y-5">
	{#await data.organizationDetails}
		<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
	{:then organizationDetails}
		{@const organizationInfo = Object.entries(organizationDetails?.organization).filter(filterOrgEntries).map(([key, value]) => ({ label: key, value }))}
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-5">
			{#each organizationInfo as { label, value } (label)}
				<p class=" font-normal text-sm text-stone-500">{$_(`admin-pages.organizations.${label}`)}</p>
				<p class=" w-full text-right font-normal text-sm text-stone-800">{value}</p>{/each}
		</div>
	{:catch error}
		<p>{error.message}</p>
	{/await}

	<section>
		<h3 class=" text-xl font-semibold text-stone-800">{$_(`admin-pages.organizations.contactPeople`)}</h3>
		{#await data.orgData}
			<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
		{:then orgData}
			{#if orgData?.createInviteForm}
				<ManageOrgMembers organizationMembers={orgData?.orgMembers} createInviteForm={orgData?.createInviteForm} />
			{/if}
		{:catch error}
			<p>{error.message}</p>
		{/await}

	</section>
</section>
