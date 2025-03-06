<script lang="ts">
	import type { GetEventRegistrationsForOrganizationResponse } from '@schema';
	import SuperDebug from 'sveltekit-superforms';
	import DataTable from "./data-table.svelte";
	import { writable } from 'svelte/store';
	import { setContext } from 'svelte';
	import type { InferOutput } from 'valibot';
	export let eventRegistrations: InferOutput<GetEventRegistrationsForOrganizationResponse>;
	export let uploadCatalogueDataForm: any;


	let uploadCatalogueDataFormStore = writable(uploadCatalogueDataForm);
	$: {
		uploadCatalogueDataFormStore.set(uploadCatalogueDataForm);
	}

	setContext('uploadCatalogueDataForm', uploadCatalogueDataFormStore);
</script>

<DataTable {eventRegistrations} />

<SuperDebug data={eventRegistrations} />