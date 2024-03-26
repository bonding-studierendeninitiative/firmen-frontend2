<script lang="ts">
	export let message: string = '';
</script>

{#if message}
	<p class=" mt-2 text-stone-500 font-normal text-sm">
		{message}
	</p>
{/if}
