<script lang="ts">
	import { EditOrganizationDetailsForm } from '@/@svelte/modules';
	import { LoaderCircle } from 'lucide-svelte';
	import { fade } from 'svelte/transition';

	let { data } = $props();
</script>
{#await data.editOrganizationDetailsForm}
	<LoaderCircle class="w-10 h-10 mx-auto animate-spin" />
{:then editOrganizationDetailsForm}
	<div in:fade>
		<EditOrganizationDetailsForm {editOrganizationDetailsForm} />
	</div>
{:catch error}
	<p>{error}</p>
{/await}