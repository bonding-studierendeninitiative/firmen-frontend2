<script lang="ts">
	import { _ } from '@services';
	import { LoaderCircle } from '@lucide/svelte';
	import { derived, type Readable, readable, writable } from 'svelte/store';
	import { SearchInput } from '@/@svelte/components';
	import { CreateOrgDialog } from '@/@svelte/modules';
	import { type AdminOrgsOutput, trpc } from '@/trpc/client';
	import { page } from '$app/state';
	import { debouncer } from '@/stores/debouncer.js';
	import { queryParameters } from 'sveltekit-search-params';
	import OrganizationsDataTable from './organizations-data-table.svelte';
	import SuperDebug from 'sveltekit-superforms';
	import ImportLegacyOrgDialog from './import-legacy-org-dialog.svelte';

	let params = queryParameters({
		sort: false,
		page: false,
		limit: false
	});

	let { data } = $props();

	let queryValue = writable('');

	let filters = derived([queryValue, params], ([queryValue, params]) => ({
		query: queryValue,
		page: Number(params.page) || 0,
		limit: Number(params.limit) || 10,
		includeMembersCount: true,
		orderBy: params.sort ? decodeURIComponent(params.sort!) : undefined
	}));

	const api = trpc(page);
	const opts = writable(
		api.admin.orgs.list.createQuery.opts({
			initialData: data.orgs,
			staleTime: 0
		})
	);

	const orgsQuery = api.admin.orgs.list.createQuery(debouncer(filters), opts);
	const orgsData: Readable<AdminOrgsOutput['data']> = derived([orgsQuery], ([query]) => {
		if (query.isLoading) return [];
		// check if the loaded page is "out of bounds"
		else if (
			query.data?.data.length === 0 &&
			Math.floor(query.data.totalCount / query.data.limit) < query.data.page
		) {
			$params.page = '0';
		}
		return query.data?.data ?? [];
	});
</script>

<div>
	<section>
		<h1 class=" text-stone-950 text-3xl font-extrabold">
			{$_('admin-pages.organizations.allOrganizations')}
		</h1>
	</section>
	<section class="flex gap-x-4 mt-6">
		<SearchInput
			class="max-w-sm"
			placeholder={$_('common.search')}
			type="text"
			bind:value={$queryValue}
		/>
		<div class="grow"></div>
		<CreateOrgDialog />
		<ImportLegacyOrgDialog />
	</section>
	{#if $orgsQuery.isLoading}
		<LoaderCircle class="size-10 mx-auto animate-spin" />
	{:else if $orgsData}
		<OrganizationsDataTable
			isLoading={$orgsQuery.isFetching}
			organizations={$orgsData}
			totalCount={derived([orgsQuery], ([query]) => query.data?.totalCount ?? 0)}
		/>
	{/if}
</div>
