<script lang="ts">
	import type { PageData } from './$types';
	import { PortraitForm } from '@/@svelte/modules';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import { trpc } from '@/trpc/client';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

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
			console.log("Protrait closed in Page");
			goto('..');
		}}
	/>
{:catch error}
	<p>{error.message}</p>
{/await}
