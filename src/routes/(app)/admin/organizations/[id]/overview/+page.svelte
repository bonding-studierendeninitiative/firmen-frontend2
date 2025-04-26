<script lang="ts">
	import { _ } from '@services';
	import { ManageOrgMembers } from '@/@svelte/modules';
	import { LoaderCircle } from 'lucide-svelte';
	import { page } from '$app/stores';
	import { trpc } from '@/trpc/client.js';
	import { queryParameters } from 'sveltekit-search-params';
	import { derived } from 'svelte/store';

	export let data;

	let params = queryParameters({
		page: false,
		limit: false,
		sort: false
	});

	function filterOrgEntries(tuple: [string, any]): tuple is [string, string] {
		console.log(tuple);
		const [key, value] = tuple;
		const excludedKeys = [
			'id',
			'createdAt',
			'modifiedAt',
			'slug',
			'name',
			'organizationType',
			'imageUrl'
		];
		const keyValid = key != undefined && !excludedKeys.includes(key);
		const valueValid = typeof value === 'string';
		return keyValid && valueValid;
	}

	const api = trpc($page);

	const opts = api.admin.orgs.members.getAll.createQuery.opts({
		initialData: data.orgMembers,
		staleTime: 0
	});

	const filters = derived([params], ([params]) => ({
		organizationId: data.organizationId,
		limit: Number(params.limit || '10'),
		page: Number(params.page || '0'),
		sort: params.sort
	}));

	const orgMembersQuery = api.admin.orgs.members.getAll.createQuery(filters, opts);
	const orgDetailsQuery = api.admin.orgs.getDetails.createQuery({
		organizationId: data.organizationId
	});
	const orgMembersData = derived([orgMembersQuery], ([orgMembersQuery]) => {
		return orgMembersQuery.data;
	});
</script>

<section class="space-y-5">
	{#if $orgDetailsQuery.isLoading}
		<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
	{/if}
	{#if $orgDetailsQuery.data}
		{@const organizationInfo = Object.entries($orgDetailsQuery.data?)
			.filter(filterOrgEntries)
			.map(([key, value]) => ({ label: key, value }))}
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full mt-5">
			{#each organizationInfo as { label, value } (label)}
				<p class=" font-normal text-sm text-stone-500">
					{$_(`admin-pages.organizations.${label}`)}
				</p>
				<p class=" w-full text-right font-normal text-sm text-stone-800">
					{#if label === 'createdBy'}
						{@const creator = $orgMembersData?.data.find((item) => {
							return item.publicUserData?.userId === value;
						})}
						{creator?.publicUserData?.firstName}
						{creator?.publicUserData?.lastName}
					{:else}
						{value}
					{/if}
				</p>
			{/each}
		</div>
	{/if}

	<h3 class=" text-xl font-semibold text-stone-800">
		{$_(`admin-pages.organizations.contactPeople`)}
	</h3>
	{#if $orgMembersQuery.isLoading}
		<LoaderCircle class="w-12 h-12 animate-spin mx-auto" />
	{/if}
	{#if $orgMembersQuery.data}
		<ManageOrgMembers memberResponse={orgMembersData} />
	{/if}
</section>
