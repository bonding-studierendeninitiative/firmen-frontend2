<script lang="ts">
	import { trpc } from '@/trpc/client';
	import ViewLogoDialog from './ViewLogoDialog.svelte';
	import { page } from '$app/state';

	interface Props {
		open?: boolean;
		documentId: string;
	}

	let { open = $bindable(false), documentId }: Props = $props();

	const documentQuery = trpc(page).catalogueData.getDocument.createQuery({
		documentId
	});
</script>

{#if !$documentQuery.isLoading}
	<ViewLogoDialog bind:open logo={$documentQuery.data} />
{/if}
