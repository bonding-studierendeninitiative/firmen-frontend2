<script lang="ts">
	import { ExportItem } from '@/@svelte/components/ExportItem';

	export let data;
</script>

{#each data.exports ?? [] as _export}
	<ExportItem {_export} />
{/each}

