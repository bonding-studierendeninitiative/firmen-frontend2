<script lang="ts">
	import { _ } from '@services';
	import DataTable from './data-table.svelte';
	import SuperDebug, { type SuperValidated } from 'sveltekit-superforms';
	import type { InferOutput } from 'valibot';
	import type { CreateOrgRequest } from '@schema';
	import { LoaderCircle } from 'lucide-svelte';

	export let data;
	let createOrgForm: SuperValidated<InferOutput<CreateOrgRequest>> | undefined =data.createForm;
</script>

<div>
	<section>
		<h1 class=" text-stone-950 text-3xl font-extrabold">
			{$_('admin-pages.organizations.allOrganizations')}
		</h1>
	</section>
	<section class=" mt-10">
		{#await data.organizationInfo}
			<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
		{:then organizationInfo}
			<DataTable organizations={organizationInfo?.organizations} {createOrgForm}/>
		{:catch error}
			<p>{error.message}</p>
		{/await}
	</section>
</div>