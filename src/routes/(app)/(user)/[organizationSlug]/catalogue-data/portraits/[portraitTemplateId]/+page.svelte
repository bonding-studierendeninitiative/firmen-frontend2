<script lang="ts">
	import type { PageData } from './$types';
	import { PortraitForm } from '@/@svelte/modules';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';

	export let data: PageData;

	let [editFormQuery, resolveForm] = trpc(page).portraitTemplates.editForm.createQuery(
		page.params.portraitTemplateId,
		{
			lazy: true
		}
	);
</script>

{#await resolveForm(data.editForm) then editForm}
	<PortraitForm
		validated={$editFormQuery.data}
		isOpen={true}
		onDialogChange={() => {
			goto('..');
		}}
	/>
{:catch error}
	<p>{error.message}</p>
{/await}
