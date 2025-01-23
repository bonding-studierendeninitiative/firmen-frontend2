<script lang="ts">
	import type { GetEventRegistrationsForOrganizationResponse } from '@schema';
	import SuperDebug from 'sveltekit-superforms';
	import DataTable from "./data-table.svelte";
	export let eventRegistrations: GetEventRegistrationsForOrganizationResponse;
</script>

<DataTable bind:eventRegistrations />

<SuperDebug data={eventRegistrations} />