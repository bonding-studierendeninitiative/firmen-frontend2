<script lang="ts">
	import { _ } from '@services';
	import { NoDataFound } from '@/@svelte/components';
	import DataTable from './data-table.svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	export let data;
</script>

{#await data.tableData}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then data}
	<section in:fade class=" mt-6">
		{#if !data?.eventRegistrations}
			<section class=" mt-10">
				<NoDataFound
					heading={$_('admin-pages.events.noRegistrationsFound')}
					subHeading={$_('admin-pages.events.noDataToDisplay')}
					buttonText={$_('admin-pages.events.backToEvents')}
				/>
			</section>
		{:else}
			<section class=" mt-10">
				<DataTable
					addons={data?.addons}
					data={data?.eventRegistrations}
					addonPackages={data?.addonPackages}
					status={data?.status}
					packages={data?.packages}
				/>
			</section>
		{/if}
	</section>
{:catch error}
	<p>{error.message}</p>
{/await}
