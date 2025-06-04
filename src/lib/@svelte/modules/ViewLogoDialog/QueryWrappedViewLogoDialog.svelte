<script lang="ts">
	import { trpc } from '@/trpc/client';
	import ViewLogoDialog from './ViewLogoDialog.svelte';
	import { page } from '$app/stores';

	export let open: boolean = false;
	export let documentId: string;

	const documentQuery = trpc($page).catalogueData.getDocument.createQuery({
		documentId
	});
</script>

{#if !$documentQuery.isLoading}
	<ViewLogoDialog bind:open logo={$documentQuery.data} />
{/if}
