<script lang="ts">
	import { _ } from '@services';
	import { CompanyDetails } from '$lib/@svelte/modules';
	import type { PageServerData } from './$types';
	import DataTable from './data-table.svelte';


	export let data: PageServerData;

	const organizations = data?.organizations;

	let isDrawerOpen: boolean = false;
</script>

<div>
	<section>
		<h1 class=" text-stone-950 text-3xl font-extrabold">
			{$_('admin-pages.companies.allCompanies')}
		</h1>
	</section>
	<section class=" mt-10">
		<DataTable data={organizations} />
	</section>
</div>
<CompanyDetails bind:isOpen={isDrawerOpen} />
