<script lang="ts">
	import { ExportItem } from '@/@svelte/components/ExportItem';

	let { data } = $props();
</script>

{#each data.exports ?? [] as _export}
	<ExportItem {_export} />
{/each}

