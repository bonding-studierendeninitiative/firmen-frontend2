<script lang="ts">
	export let classes: string = '';
	export let onClick: () => void;
</script>

<button
	on:click={onClick}
	class={'px-3 py-2.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-400 '.concat(
		classes
	)}
>
	<slot />
</button>
