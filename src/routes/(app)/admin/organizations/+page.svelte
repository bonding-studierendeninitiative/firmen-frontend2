<script lang="ts">
	import { _ } from '@services';
	import type { LayoutServerData, PageServerData } from './$types';
	import DataTable from './data-table.svelte';

	export let data: PageServerData;

	console.log(data);
</script>

<div>
	<section>
		<h1 class=" text-stone-950 text-3xl font-extrabold">
			{$_('admin-pages.organizations.allOrganizations')}
		</h1>
	</section>
	<section class=" mt-10">
		<DataTable data={data?.organizations} />
	</section>
</div>