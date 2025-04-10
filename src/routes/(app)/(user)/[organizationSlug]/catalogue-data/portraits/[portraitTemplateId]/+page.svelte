<script lang="ts">
	import type { PageData } from './$types';
	import { PortraitForm } from '@/@svelte/modules';
	import { goto } from '$app/navigation';

	export let data: PageData;
</script>

{#await data.editForm}
{:then editForm}
	<PortraitForm validated={editForm} isOpen={true}
								onDialogChange={() => {
									goto("..")
								}} />
{:catch error}
	<p>{error.message}</p>
{/await}
