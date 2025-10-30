<script lang="ts">
	import { PortraitForm } from '@/@svelte/modules';
	import { goto } from '$app/navigation';
	import { editPortraitTemplateForm } from '@/remote/functions';

	let { params } = $props();

	let editFormQuery = editPortraitTemplateForm(params.portraitTemplateId!);
</script>

{#if editFormQuery.ready}
	<PortraitForm
		validated={editFormQuery.current}
		isOpen={true}
		onDialogChange={() => {
			console.log('Protrait closed in Page');
			goto('..');
		}}
	/>
{/if}
