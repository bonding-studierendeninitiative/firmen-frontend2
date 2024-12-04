<script lang="ts">
	import { _ } from '@services';
	import type { CreateOrgInviteRequest, GetOrgMembersResponse } from '@schema';
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { InferOutput } from 'valibot';
	import { getContext } from 'svelte';
	import type { ReadOrWritable } from 'svelte-headless-table';
	import { ManageOrgMembers } from '@/@svelte/modules';

	export let organizationInfo: { label: string; value: string }[];
	export let createInviteForm: ReadOrWritable<SuperValidated<InferOutput<CreateOrgInviteRequest>>> | undefined = getContext('createInviteForm');
	export let orgMembers: InferOutput<GetOrgMembersResponse>;

	console.log({ organizationInfo, orgMembers });
</script>

<section class="space-y-16">
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
		{#each organizationInfo as { label, value } (label)}
			<p class=" font-normal text-sm text-stone-500">{$_(`admin-pages.organizations.${label}`)}</p>
			<p class=" w-full text-right font-normal text-sm text-stone-800">{value}</p>{/each}
	</div>
	<section>
		<h3 class=" text-xl font-semibold text-stone-800">{$_(`admin-pages.organizations.contactPeople`)}</h3>
		{#if createInviteForm}
			<ManageOrgMembers organizationMembers={orgMembers} createInviteForm={$createInviteForm} />
		{/if}
	</section>
</section>
