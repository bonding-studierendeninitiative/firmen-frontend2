<script lang="ts">
	import { getDocument } from '@/remote/functions';
	import ViewLogoDialog from './ViewLogoDialog.svelte';

	interface Props {
		open?: boolean;
		documentId: string;
	}

	let { open = $bindable(false), documentId }: Props = $props();

	let documentQuery = getDocument({ documentId });
</script>

{#if documentQuery.ready}
	<ViewLogoDialog bind:open logo={documentQuery.current} />
{/if}
