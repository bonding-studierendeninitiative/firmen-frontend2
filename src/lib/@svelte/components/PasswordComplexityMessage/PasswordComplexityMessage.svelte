<script lang="ts">
	import { FilledCheckIcon, FilledCrossIcon } from '$lib/@svelte';
	export let message = '';
	export let isValid = true;
</script>

<div class=" flex">
	{#if isValid}<FilledCheckIcon />{:else}<FilledCrossIcon />{/if}
	<p class={`${isValid ? ' text-green-600' : ' text-error'} ml-2`}>{message}</p>
</div>
