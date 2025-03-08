<script lang="ts">
	import { _ } from '@services';
	import DataTable from './data-table.svelte';
	import { LoaderCircle } from 'lucide-svelte';
	import { writable } from 'svelte/store';
	import { SearchInput } from '@/@svelte/components';
	import { CreateOrgDialog } from '@/@svelte/modules';

	export let data;
	let filterValue = writable('');
</script>

<div>
	<section>
		<h1 class=" text-stone-950 text-3xl font-extrabold">
			{$_('admin-pages.organizations.allOrganizations')}
		</h1>
	</section>
	<section class="flex gap-x-4 mt-4">
		<SearchInput
			class="max-w-sm"
			placeholder={$_('common.search')}
			type="text"
			bind:value={$filterValue}
		/>
		<div class="flex-grow"></div>
		{#await data.createForm}
			<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
		{:then createForm}
			<CreateOrgDialog {createForm} />
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</section>
	<section class=" mt-10">
		{#await data.organizationInfo}
			<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
		{:then organizationInfo}
			<DataTable organizations={organizationInfo?.organizations} bind:filterValue />
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</section>
</div>