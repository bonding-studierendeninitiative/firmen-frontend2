<script lang="ts">
	import type { GetEventRegistrationsForOrganizationResponseType } from '@schema';
	import SuperDebug from 'sveltekit-superforms';
	import * as v from 'valibot';
	import DataTable from "./data-table.svelte";
	export let eventRegistrations: GetEventRegistrationsForOrganizationResponseType;
</script>

<DataTable bind:eventRegistrations />

<SuperDebug data={eventRegistrations} />