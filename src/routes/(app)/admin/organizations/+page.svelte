<script lang="ts">
	import { _ } from '@services';
	import { SearchInput } from '@/@svelte/components';
	import { CreateOrgDialog } from '@/@svelte/modules';
	import OrganizationsDataTable from './organizations-data-table.svelte';
	import ImportLegacyOrgDialog from './import-legacy-org-dialog.svelte';
	import { fade } from 'svelte/transition';
	import { getOrgs } from '@/remote/functions/admin';
	import { queryParameters, ssp } from 'sveltekit-search-params';

	let params = queryParameters(
		{
			query: ssp.string(''),
			sortBy: ssp.string('name'),
			sortDirection: ssp.string('asc'),
			page: ssp.number(0),
			limit: ssp.number(10)
		},
		{
			showDefaults: false
		}
	);

	let queryValue = $state('');

	let filters = $derived.by(() => ({
		query: queryValue,
		page: params.page,
		limit: params.limit,
		includeMembers: true,
		orderBy: params.sortBy as 'name' | 'createdAt' | 'members',
		sortDirection: params.sortDirection as 'asc' | 'desc'
	}));
</script>

<div in:fade>
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
			bind:value={queryValue}
		/>
		<div class="grow"></div>
		<CreateOrgDialog />
		<ImportLegacyOrgDialog />
	</section>
	<OrganizationsDataTable
		isLoading={getOrgs(filters).loading}
		organizations={(await getOrgs(filters)).data ?? []}
		totalCount={(await getOrgs(filters)).totalCount || 0}
		{params}
	/>
</div>
