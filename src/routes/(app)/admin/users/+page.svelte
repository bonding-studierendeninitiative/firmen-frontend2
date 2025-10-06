<script lang="ts">
	import UsersDataTable from './users-data-table.svelte';
	import { queryParameters, ssp } from 'sveltekit-search-params';
	import { _ } from '@services';
	import { fade } from 'svelte/transition';
	import { getUsers } from '@/trpc/routers/admin';

	let params = queryParameters(
		{
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
		sortBy: params.sortBy as 'name' | 'createdAt' | 'members',
		sortDirection: params.sortDirection as 'asc' | 'desc'
	}));
</script>

<div in:fade>
	<section>
		<h1 class=" text-stone-950 text-3xl font-extrabold">
			{$_('admin-pages.users.allUsers')}
		</h1>
	</section>
	<UsersDataTable
		{params}
		users={(await getUsers(filters)).data}
		totalCount={(await getUsers(filters)).totalCount || 0}
		isLoading={getUsers(filters).loading}
	/>
</div>
